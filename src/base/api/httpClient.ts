export type HttpOptions = Omit<RequestInit, 'method' | 'body'> & {
  // undefined: use the configured token; null: explicitly send no token.
  accessToken?: string | null;
};

type HttpClientConfig = {
  baseUrl: string;
  getAccessToken?: () => string | null | undefined;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const errorMessage = (status: number, authenticated: boolean) => {
  switch (status) {
    case 401:
      return authenticated
        ? 'Phiên đăng nhập đã hết hạn. Hãy đăng xuất rồi đăng nhập lại.'
        : 'Email hoặc mật khẩu không đúng.';
    case 409:
      return 'Email này đã được đăng ký.';
    case 404:
      return 'Không tìm thấy sổ hoặc giao dịch bạn được phép truy cập.';
    case 400:
      return 'Thông tin chưa hợp lệ. Hãy kiểm tra lại số tiền, ngày giờ, danh mục và ví.';
    default:
      return 'Không thực hiện được yêu cầu. Vui lòng thử lại sau.';
  }
};

// JSON transport for this project's { success, data } API contract.
export const createHttpClient = (config: HttpClientConfig) => {
  const baseUrl = config.baseUrl.replace(/\/$/, '');

  const request = async <T>(
    method: string,
    path: string,
    body: unknown,
    options: HttpOptions = {},
  ): Promise<T> => {
    const { accessToken, ...init } = options;
    const token = accessToken === undefined ? config.getAccessToken?.() : accessToken;
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (body !== undefined) headers.set('Content-Type', 'application/json');
    // Authorization is owned by accessToken, including the public-request override.
    headers.delete('Authorization');
    if (token) headers.set('Authorization', 'Bearer ' + token);
    const serializedBody = body === undefined ? undefined : JSON.stringify(body);
    let response: Response;
    try {
      response = await fetch(baseUrl + path, { ...init, method, headers, body: serializedBody });
    } catch (error) {
      if (init.signal?.aborted) throw error;
      throw new Error('Không kết nối được máy chủ. Hãy kiểm tra kết nối rồi thử lại.', {
        cause: error,
      });
    }
    if (!response.ok) throw new ApiError(response.status, errorMessage(response.status, !!token));
    if (response.status === 204) return undefined as T;
    const envelope: unknown = await response.json();
    if (
      !envelope ||
      typeof envelope !== 'object' ||
      !('success' in envelope) ||
      envelope.success !== true ||
      (!('data' in envelope) &&
        !(method === 'DELETE' && 'message' in envelope && typeof envelope.message === 'string'))
    ) {
      throw new Error('Máy chủ trả về dữ liệu không hợp lệ.');
    }
    return 'data' in envelope ? (envelope.data as T) : (undefined as T);
  };

  return {
    get: <T>(path: string, options?: HttpOptions) => request<T>('GET', path, undefined, options),
    post: <T, TBody = unknown>(path: string, body: TBody, options?: HttpOptions) =>
      request<T>('POST', path, body, options),
    put: <T, TBody = unknown>(path: string, body: TBody, options?: HttpOptions) =>
      request<T>('PUT', path, body, options),
    patch: <T, TBody = unknown>(path: string, body: TBody, options?: HttpOptions) =>
      request<T>('PATCH', path, body, options),
    delete: <T = void>(path: string, options?: HttpOptions) =>
      request<T>('DELETE', path, undefined, options),
  };
};

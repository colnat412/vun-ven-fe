export type HttpOptions = Omit<RequestInit, 'method' | 'body'> & {
  // undefined: use the configured token; null: explicitly send no token.
  accessToken?: string | null;
};

type HttpClientConfig = {
  baseUrl: string;
  getAccessToken?: () => string | null | undefined;
};

export const GENERIC_API_ERROR_MESSAGE = 'Có lỗi xảy ra. Vui lòng thử lại.';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(GENERIC_API_ERROR_MESSAGE);
    this.name = 'ApiError';
    this.status = status;
  }
}

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
      throw new Error(GENERIC_API_ERROR_MESSAGE, {
        cause: error,
      });
    }
    if (!response.ok) throw new ApiError(response.status);
    if (response.status === 204) return undefined as T;
    let envelope: unknown;
    try {
      envelope = await response.json();
    } catch (error) {
      throw new Error(GENERIC_API_ERROR_MESSAGE, { cause: error });
    }
    if (
      !envelope ||
      typeof envelope !== 'object' ||
      !('success' in envelope) ||
      envelope.success !== true ||
      (!('data' in envelope) &&
        !(method === 'DELETE' && 'message' in envelope && typeof envelope.message === 'string'))
    ) {
      throw new Error(GENERIC_API_ERROR_MESSAGE);
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

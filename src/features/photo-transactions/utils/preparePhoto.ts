// Normalize camera images (including orientation), strip metadata and bound upload size.
export async function preparePhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Hãy chọn ảnh JPG, PNG hoặc WebP.');
  }
  if (file.size > 20 * 1024 * 1024) throw new Error('Hãy chọn ảnh nhỏ hơn 20 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error();
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const data = canvas.toDataURL('image/jpeg', quality);
      if (data.length <= 650_000) return data;
    }
    throw new Error('Ảnh có quá nhiều chi tiết. Hãy cắt gọn phần hóa đơn rồi chọn lại.');
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Ảnh có')) throw error;
    throw new Error('Không đọc được ảnh này. Hãy chọn ảnh JPG, PNG hoặc WebP khác.', {
      cause: error,
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

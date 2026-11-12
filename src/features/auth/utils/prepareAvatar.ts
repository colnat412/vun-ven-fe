export type AvatarCrop = { zoom: number; x: number; y: number };

// Apply the preview crop, strip metadata and bound the image before upload.
export async function prepareAvatar(file: File, crop: AvatarCrop): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Hãy chọn ảnh JPG, PNG hoặc WebP.');
  }
  if (file.size > 20 * 1024 * 1024) throw new Error('Hãy chọn ảnh nhỏ hơn 20 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const side =
      Math.min(image.naturalWidth, image.naturalHeight) / Math.max(1, Math.min(3, crop.zoom));
    if (!side) throw new Error();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = Math.min(side, 512);
    const context = canvas.getContext('2d');
    if (!context) throw new Error();
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      image,
      ((image.naturalWidth - side) / 2) * (1 - Math.max(-1, Math.min(1, crop.x))),
      ((image.naturalHeight - side) / 2) * (1 - Math.max(-1, Math.min(1, crop.y))),
      side,
      side,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch {
    throw new Error('Không đọc được ảnh này. Hãy chọn ảnh JPG, PNG hoặc WebP khác.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

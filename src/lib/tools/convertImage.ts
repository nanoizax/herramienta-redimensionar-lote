export type ImageFormat = "image/png" | "image/jpeg" | "image/webp";

export interface ConvertImageOptions {
  format: ImageFormat;
  width?: number;
  height?: number;
  quality?: number;
}

const EXTENSION_BY_FORMAT: Record<ImageFormat, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export function extensionForFormat(format: ImageFormat): string {
  return EXTENSION_BY_FORMAT[format];
}

/**
 * Convierte/redimensiona una imagen 100% en el navegador via Canvas.
 * El archivo nunca sale del dispositivo del usuario.
 */
export async function convertImage(
  file: File,
  { format, width, height, quality = 0.92 }: ConvertImageOptions
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const targetWidth = width && width > 0 ? width : bitmap.width;
  const targetHeight = height && height > 0 ? height : bitmap.height;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el contexto de canvas");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen"))),
      format,
      quality
    );
  });
}

export function loadImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = url;
  });
}

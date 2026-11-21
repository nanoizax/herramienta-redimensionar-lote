import { convertImage, type ImageFormat } from "./convertImage";

export interface ResizedImage {
  name: string;
  blob: Blob;
}

export async function resizeBatch(
  files: File[],
  { width, height, format }: { width: number; height: number; format: ImageFormat },
  onProgress?: (done: number, total: number) => void
): Promise<ResizedImage[]> {
  const results: ResizedImage[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const blob = await convertImage(file, { format, width, height });
    const base = file.name.replace(/\.[^.]+$/, "");
    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    results.push({ name: `${base}.${ext}`, blob });
    onProgress?.(i + 1, files.length);
  }

  return results;
}

export async function bundleResizedAsZip(images: ResizedImage[]): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const img of images) {
    zip.file(img.name, await img.blob.arrayBuffer());
  }
  return zip.generateAsync({ type: "blob" });
}

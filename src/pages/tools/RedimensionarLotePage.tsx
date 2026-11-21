import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, X, Image as ImageIcon } from "lucide-react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropZone from "@/components/tools/FileDropZone";
import { Button } from "@/components/ui/button";
import { resizeBatch, bundleResizedAsZip, type ResizedImage } from "@/lib/tools/batchResize";
import type { ImageFormat } from "@/lib/tools/convertImage";
import { formatBytes } from "@/lib/tools/compressFile";

const RedimensionarLotePage = () => {
  const { t } = useTranslation("tools");

  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const [format, setFormat] = useState<ImageFormat>("image/jpeg");
  const [results, setResults] = useState<ResizedImage[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResults(null);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFiles([]);
    setResults(null);
    setError(null);
  };

  const handleResize = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const resized = await resizeBatch(files, { width, height, format }, (done, total) =>
        setProgress({ done, total })
      );
      setResults(resized);
    } catch {
      setError(t("ui.error_generic"));
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const handleDownloadZip = async () => {
    if (!results) return;
    setProcessing(true);
    try {
      const blob = await bundleResizedAsZip(results);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "imagenes-redimensionadas.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(t("ui.error_generic"));
    } finally {
      setProcessing(false);
    }
  };

  const formatButtonClass = (active: boolean) =>
    `rounded-full px-5 ${
      active ? "bg-white text-black" : "bg-transparent text-white border border-neutral-700 hover:bg-white/10"
    }`;

  return (
    <ToolPageLayout toolId="redimensionar-lote">
      <div className="border border-neutral-800 rounded-xl p-6 md:p-8 space-y-4">
        <FileDropZone
          accept="image/jpeg,image/png,image/webp"
          label={t("ui.upload_label_images_multiple")}
          hint={t("ui.upload_hint")}
          multiple
          onFile={() => {}}
          onFiles={addFiles}
          toolId="redimensionar-lote"
        />

        {files.length > 0 && (
          <div className="border border-neutral-800 rounded-lg divide-y divide-neutral-800 max-h-64 overflow-y-auto">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <ImageIcon className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-sm text-neutral-300 truncate">{file.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-neutral-500 hover:text-white transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-400 text-sm mb-2">{t("ui.width_label")}</p>
                <input
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value) || 1)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>
              <div>
                <p className="text-neutral-400 text-sm mb-2">{t("ui.height_label")}</p>
                <input
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 1)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setFormat("image/jpeg")} className={formatButtonClass(format === "image/jpeg")}>
                JPG
              </button>
              <button onClick={() => setFormat("image/png")} className={formatButtonClass(format === "image/png")}>
                PNG
              </button>
              <button onClick={() => setFormat("image/webp")} className={formatButtonClass(format === "image/webp")}>
                WEBP
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleResize}
                isLoading={processing && !results}
                loadingText={progress ? `${t("ui.processing")} ${progress.done}/${progress.total}` : t("ui.processing")}
                className="bg-white text-black hover:bg-white/80 rounded-full px-8"
              >
                {t("ui.resize_batch_button")}
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                className="rounded-full px-6 border-neutral-700 text-white bg-transparent hover:bg-white/10"
              >
                {t("ui.reset_button")}
              </Button>
            </div>
          </>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-sm">{t("ui.split_page_count", { count: results.length })}</span>
              <Button
                onClick={handleDownloadZip}
                isLoading={processing}
                loadingText={t("ui.processing")}
                className="bg-white text-black hover:bg-white/80 rounded-full px-6"
              >
                <Download className="w-4 h-4" />
                {t("ui.download_all_button")}
              </Button>
            </div>
            <div className="border border-neutral-800 rounded-lg divide-y divide-neutral-800 max-h-64 overflow-y-auto">
              {results.map((img, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-sm text-neutral-300 truncate">{img.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500">{formatBytes(img.blob.size)}</span>
                    <a
                      href={URL.createObjectURL(img.blob)}
                      download={img.name}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default RedimensionarLotePage;

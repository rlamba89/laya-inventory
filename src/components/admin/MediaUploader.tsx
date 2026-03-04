"use client";

import { useState, useRef, useCallback } from "react";
import { MediaType } from "@/lib/types";

interface MediaUploaderProps {
  projectSlug: string;
  mediaType: MediaType;
  variant?: string;
  unitId?: string;
  unitTypeId?: string;
  onUploaded: () => void;
}

export function MediaUploader({
  projectSlug,
  mediaType,
  variant,
  unitId,
  unitTypeId,
  onUploaded,
}: MediaUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("media_type", mediaType);
      if (variant) formData.append("variant", variant);
      if (unitId) formData.append("unit_id", unitId);
      if (unitTypeId) formData.append("unit_type_id", unitTypeId);

      try {
        const res = await fetch(
          `/api/projects/${projectSlug}/media/upload`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        onUploaded();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [projectSlug, mediaType, variant, unitId, unitTypeId, onUploaded]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      // Upload one at a time
      Array.from(files).forEach((file) => uploadFile(file));
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? "border-gold bg-gold/5"
            : "border-sand hover:border-gold/50 hover:bg-ivory/50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <p className="mt-3 text-sm text-stone">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand-light">
              <span className="text-xl text-stone">+</span>
            </div>
            <p className="mt-3 text-sm font-medium text-charcoal">
              Drop images here or click to browse
            </p>
            <p className="mt-1 text-[10px] text-stone">
              JPEG, PNG, WebP, SVG up to 10MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

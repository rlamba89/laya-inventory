"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Media, MediaType } from "@/lib/types";
import { MediaUploader } from "./MediaUploader";

const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  floorplan: "Floor Plan",
  render: "Render",
  photo: "Photo",
  siteplan: "Siteplan",
  gallery: "Gallery",
};

const MEDIA_TYPE_COLORS: Record<MediaType, string> = {
  floorplan: "bg-blue-100 text-blue-700",
  render: "bg-purple-100 text-purple-700",
  photo: "bg-emerald-100 text-emerald-700",
  siteplan: "bg-amber-100 text-amber-700",
  gallery: "bg-rose-100 text-rose-700",
};

interface MediaGalleryProps {
  projectSlug: string;
  unitTypes: { id: string; code: string; name: string | null }[];
}

export function MediaGallery({ projectSlug, unitTypes }: MediaGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Filters
  const [filterType, setFilterType] = useState<MediaType | "all">("all");
  const [filterUnitType, setFilterUnitType] = useState<string>("all");

  // Upload form state
  const [uploadMediaType, setUploadMediaType] = useState<MediaType>("floorplan");
  const [uploadVariant, setUploadVariant] = useState("");
  const [uploadUnitTypeId, setUploadUnitTypeId] = useState("");

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/projects/${projectSlug}/media`;
      const params = new URLSearchParams();
      if (filterType !== "all") params.set("media_type", filterType);
      if (filterUnitType !== "all") params.set("unit_type_id", filterUnitType);
      if (params.toString()) url += `?${params}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch media");
      const data = await res.json();
      setMedia(data.media);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [projectSlug, filterType, filterUnitType]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Delete this media item?")) return;
    setDeleting(mediaId);
    setError("");
    try {
      const res = await fetch(
        `/api/projects/${projectSlug}/media?id=${mediaId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const getUnitTypeLabel = (id: string | null) => {
    if (!id) return null;
    const ut = unitTypes.find((t) => t.id === id);
    return ut ? `Type ${ut.code}` : null;
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Media Management
        </h1>
        <p className="mt-1 text-sm text-stone">
          Upload and manage project images — floor plans, renders, photos
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-8 rounded-xl border border-sand bg-sand-light/30 p-5">
        <h2 className="mb-4 text-sm font-semibold text-charcoal">Upload New Media</h2>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Media Type */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-stone">
              Type
            </label>
            <select
              value={uploadMediaType}
              onChange={(e) => setUploadMediaType(e.target.value as MediaType)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="floorplan">Floor Plan</option>
              <option value="render">Render</option>
              <option value="photo">Photo</option>
              <option value="gallery">Gallery</option>
              <option value="siteplan">Siteplan</option>
            </select>
          </div>

          {/* Variant */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-stone">
              Variant
            </label>
            <select
              value={uploadVariant}
              onChange={(e) => setUploadVariant(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="">None</option>
              <option value="ground">Ground Floor</option>
              <option value="upper">Upper Floor</option>
              <option value="facade">Facade</option>
              <option value="main">Main</option>
              <option value="thumbnail">Thumbnail</option>
            </select>
          </div>

          {/* Unit Type */}
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-stone">
              Unit Type
            </label>
            <select
              value={uploadUnitTypeId}
              onChange={(e) => setUploadUnitTypeId(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="">Project-level (no unit type)</option>
              {unitTypes.map((ut) => (
                <option key={ut.id} value={ut.id}>
                  Type {ut.code}{ut.name ? ` — ${ut.name}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <MediaUploader
          projectSlug={projectSlug}
          mediaType={uploadMediaType}
          variant={uploadVariant || undefined}
          unitTypeId={uploadUnitTypeId || undefined}
          onUploaded={fetchMedia}
        />
      </div>

      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone">
            Filter
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as MediaType | "all")}
            className="rounded-lg border border-sand bg-white px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="floorplan">Floor Plans</option>
            <option value="render">Renders</option>
            <option value="photo">Photos</option>
            <option value="gallery">Gallery</option>
            <option value="siteplan">Siteplan</option>
          </select>
        </div>

        {unitTypes.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={filterUnitType}
              onChange={(e) => setFilterUnitType(e.target.value)}
              className="rounded-lg border border-sand bg-white px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
            >
              <option value="all">All Unit Types</option>
              {unitTypes.map((ut) => (
                <option key={ut.id} value={ut.id}>
                  Type {ut.code}
                </option>
              ))}
            </select>
          </div>
        )}

        <span className="text-[10px] text-stone">
          {media.length} item{media.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-xl border border-sand bg-sand-light/50 p-12 text-center">
          <p className="text-sm text-stone">No media uploaded yet.</p>
          <p className="mt-1 text-[11px] text-stone/60">
            Use the uploader above to add images.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-xl border border-sand bg-white transition-shadow hover:shadow-md ${
                deleting === item.id ? "opacity-50" : ""
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-ivory/50">
                <Image
                  src={item.url}
                  alt={item.alt_text || "Media"}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Delete button (hover) */}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                >
                  &times;
                </button>
              </div>

              {/* Info */}
              <div className="border-t border-sand px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      MEDIA_TYPE_COLORS[item.media_type as MediaType]
                    }`}
                  >
                    {MEDIA_TYPE_LABELS[item.media_type as MediaType]}
                  </span>
                  {item.variant && (
                    <span className="rounded-full bg-stone/10 px-2 py-0.5 text-[9px] font-medium text-stone">
                      {item.variant}
                    </span>
                  )}
                  {getUnitTypeLabel(item.unit_type_id) && (
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-medium text-gold">
                      {getUnitTypeLabel(item.unit_type_id)}
                    </span>
                  )}
                </div>
                {item.alt_text && (
                  <p className="mt-1 truncate text-[10px] text-stone">
                    {item.alt_text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

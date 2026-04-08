"use client";

import { Chapter } from "@/lib/data";
import { IndexedFile } from "../../scripts/indexer";
import { useState } from "react";
import { ZoomIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedEntryProps {
  chapter: Chapter;
  phaseId: number;
  files: IndexedFile[];
}

export function FeedEntry({ chapter, phaseId, files }: FeedEntryProps) {
  const [lightboxOpen, setLightboxOpen] = useState<string | null>(null);

  const images = files.filter(
    (f) => f.mimeType?.startsWith("image/") || f.name.endsWith(".jpg") || f.name.endsWith(".png")
  );
  const documents = files.filter((f) => !images.includes(f));

  // Determine a featured image if any exists
  const featuredImage = images[0];
  const regularImages = images.slice(1);

  return (
    <article
      id={`chapter-${chapter.id}`}
      className="bg-white shadow-sm mb-12 flex flex-col overflow-hidden"
    >
      {/* Featured Image at top */}
      {featuredImage && (
        <div 
          className="w-full relative group cursor-pointer"
          onClick={() => setLightboxOpen(featuredImage.name)}
        >
          <img
            src={`/evidence/${featuredImage.name}`}
            alt={`Beweis für: ${chapter.title}`}
            className="w-full h-[400px] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/1000x400/e2e8f0/94a3b8?text=Bild+Nicht+Gefunden";
            }}
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ZoomIn className="text-white w-10 h-10 drop-shadow-md" />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="pt-10 px-8 lg:px-16 pb-12 flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-gray-800 leading-snug">
          {chapter.title}
        </h2>

        {/* Meta Strip */}
        <div className="flex justify-center items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-[#999999] mt-4 mb-6">
          <span>Phase {phaseId}</span>
          <span>•</span>
          <span>{chapter.evidence.length} Beweise</span>
        </div>

        {/* Teal Accent Line */}
        <div className="w-12 h-0.5 bg-[#008b8b] mx-auto mb-8"></div>

        {/* Body Text */}
        <div className="text-lg leading-8 text-gray-700 text-center max-w-3xl">
          {chapter.content}
        </div>

        {/* Secondary Images inline */}
        {regularImages.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {regularImages.map((img) => (
              <div
                key={img.id}
                className="relative group cursor-pointer overflow-hidden border border-gray-100"
                onClick={() => setLightboxOpen(img.name)}
              >
                <img
                  src={`/evidence/${img.name}`}
                  alt={`Zusatzbeweis`}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/94a3b8?text=Bild";
                  }}
                />
                <div className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={16} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Document Links Styled as Text Links */}
        {documents.length > 0 && (
          <div className="mt-10 w-full text-left">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
              Zugehörige Akten & Dokumente
            </h4>
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={`/evidence/${doc.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-b-2 border-gray-200 hover:border-[#008b8b] hover:text-[#008b8b] transition-colors py-1 text-sm text-gray-600 tracking-wide"
                  >
                    PDF: {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 p-4"
            onClick={() => setLightboxOpen(null)}
          >
            <button className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
              <X size={40} strokeWidth={1} />
            </button>
            <motion.img
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              src={`/evidence/${lightboxOpen}`}
              alt="Großansicht"
              className="max-w-full max-h-[90vh] shadow-xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

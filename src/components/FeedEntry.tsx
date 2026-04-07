"use client";

import { Chapter } from "@/lib/data";
import { IndexedFile } from "../../scripts/indexer";
import { useState } from "react";
import { FileText, Image as ImageIcon, ZoomIn, X } from "lucide-react";
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
  const documents = files.filter(
    (f) => !images.includes(f)
  );

  return (
    <article
      id={`chapter-${chapter.id}`}
      className="relative mb-16 max-w-3xl mx-auto"
    >
      {/* Blog Post Card */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-gray-700">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-red-900/40 text-red-400 text-xs font-bold uppercase tracking-wider rounded-full border border-red-900">
              Phase {phaseId}
            </span>
            <h2 className="text-2xl font-bold text-gray-100 leading-tight">
              {chapter.title}
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 mb-8 leading-relaxed text-lg">
            {chapter.content}
          </div>

          {/* Inline Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-800 focus:outline-none"
                  onClick={() => setLightboxOpen(img.name)}
                >
                  {/* Using a placeholder for unknown Google Drive images unless we have webViewLink/thumbnail. We use the /evidence fallback since it's an investigative blog */}
                  <img
                    src={`/evidence/${img.name}`}
                    alt={`Beweis für: ${chapter.title}`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1f2937/dc2626?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white w-8 h-8" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900 p-3">
                    <p className="text-xs text-gray-300 font-mono truncate">{img.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Document Previes */}
          {documents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                Dokumente & Akten
              </h4>
              <div className="flex flex-col gap-3">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={`/evidence/${doc.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-900/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">Klicken zum Öffnen</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setLightboxOpen(null)}
          >
            <button className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={`/evidence/${lightboxOpen}`}
              alt="Beweisfoto"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

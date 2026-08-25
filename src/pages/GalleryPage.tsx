import React, { useEffect, useState } from 'react';
import { Images, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

// Uses the network logo as a graceful placeholder until real screenshots are uploaded.
// Replace the `image` field with actual screenshot paths in /public when available.
const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', title: 'Spawn Hub', category: 'Builds', image: '/logo.png' },
  { id: 'g2', title: 'Survival World', category: 'Worlds', image: '/logo.png' },
  { id: 'g3', title: 'PvP Arena', category: 'Combat', image: '/logo.png' },
  { id: 'g4', title: 'Community Event', category: 'Events', image: '/logo.png' },
  { id: 'g5', title: 'Skyblock Islands', category: 'Worlds', image: '/logo.png' },
  { id: 'g6', title: 'Winter Celebration', category: 'Events', image: '/logo.png' },
  { id: 'g7', title: 'Player Creation', category: 'Builds', image: '/logo.png' },
  { id: 'g8', title: 'Boss Raid', category: 'Combat', image: '/logo.png' },
];

const CATEGORIES = ['All', 'Builds', 'Worlds', 'Combat', 'Events'];

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    document.title = 'Gallery | Butterfly Network';
  }, []);

  const filtered =
    activeCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <Images className="w-3.5 h-3.5 text-purple-400" />
            <span>Server Gallery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            Moments from Butterfly Network
          </h1>

          <p className="text-slate-300 text-base sm:text-lg">
            Builds, events, and community highlights captured across the network.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600/30 border-purple-400/50 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-purple-500/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              onClick={() => setSelected(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-purple-400/40 transition-all"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-950/40 to-black/60">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-contain opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-purple-300 text-[11px]">{item.category}</p>
                </div>
              </div>

              <Maximize2 className="absolute top-2 right-2 w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-purple-500/20 bg-[#0b0b0f] p-8"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-4">
                <img src={selected.image} alt={selected.title} className="w-32 h-32 object-contain opacity-80" />
                <h3 className="text-xl font-bold text-white">{selected.title}</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {selected.category}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

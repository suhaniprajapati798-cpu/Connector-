import React, { useState } from 'react';
import {
  X,
  Clock,
  Trash2,
  Download,
  ArrowRight,
  Search,
  Radio,
  FileText,
  Code
} from 'lucide-react';
import { DeliveryPayload } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DeliveryPayload[];
  onSelectPayload: (payload: DeliveryPayload) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPayload,
  onClearHistory
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter(
    (item) =>
      item.hook.toLowerCase().includes(search.toLowerCase()) ||
      item.caption.toLowerCase().includes(search.toLowerCase()) ||
      item.platform.toLowerCase().includes(search.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-white text-sm">Delivery Payload History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-zinc-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past payloads..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs font-mono">
              {history.length === 0 ? 'No payloads generated yet in this session.' : 'No matching payloads found.'}
            </div>
          ) : (
            filtered.map((item, index) => (
              <div
                key={item.id || index}
                className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all text-xs group cursor-pointer"
                onClick={() => {
                  onSelectPayload(item);
                  onClose();
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 uppercase">
                    {item.platform}
                  </span>
                  {item.timestamp && (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <div className="font-semibold text-zinc-200 line-clamp-1 mb-1">
                  {item.hook}
                </div>

                <div className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">
                  {item.caption}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                  <span className="font-mono">{item.hashtags.slice(0, 3).join(' ')}</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Load <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-[10px] text-zinc-500 font-mono">
              Stored locally
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { getLibrary, deleteFromLibrary } from '../services/contentWriterService';
import { SavedContent } from '../types';
import { FileText, Trash2, Edit3, Calendar, MapPin, Tag } from 'lucide-react';

interface ContentLibraryProps {
  onLoad: (content: SavedContent) => void;
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({ onLoad }) => {
  const [items, setItems] = useState<SavedContent[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    setItems(getLibrary());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      deleteFromLibrary(id);
      loadItems();
    }
  };

  if (items.length === 0) {
      return (
          <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No saved drafts yet. Create content to save it here.</p>
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {items.map((item) => (
        <div key={item.id} className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-lg hover:border-gray-700 transition-colors group">
            <div className="flex justify-between items-start mb-3">
                <div className="bg-indigo-900/20 p-2 rounded-lg text-indigo-400">
                    <FileText className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onLoad(item)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-gray-800 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <h3 className="font-bold text-white text-lg mb-1 truncate" title={item.title}>{item.title}</h3>
            <p className="text-sm text-gray-400 mb-4 truncate" title={item.keyword}>{item.keyword}</p>
            
            <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3" /> <span className="capitalize">{item.type}</span>
                </div>
                {item.location && (
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> <span>{item.location}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
                <span className="text-gray-400">{item.wordCount} words</span>
                <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded capitalize">{item.status}</span>
            </div>
        </div>
      ))}
    </div>
  );
};

export default ContentLibrary;
import React, { useState } from 'react';
import { ContentSection } from '../types';
import { ChevronDown, ChevronUp, Copy, RefreshCw, Check } from 'lucide-react';

interface SectionEditorProps {
  section: ContentSection;
  onUpdate: (id: string, newContent: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  const [expanded, setExpanded] = useState(true);
  const [content, setContent] = useState(section.content);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      onUpdate(section.id, e.target.value);
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden mb-4 transition-all hover:border-gray-700">
      <div 
        className="flex items-center justify-between p-4 bg-gray-900/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h4 className="font-bold text-gray-200 text-sm uppercase tracking-wide">{section.name}</h4>
        <div className="flex items-center gap-2">
            <button 
                onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                className="p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                title="Copy Section"
            >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-gray-800">
            <textarea 
                value={content}
                onChange={handleChange}
                className="w-full h-64 bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-sm text-gray-300 font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
        </div>
      )}
    </div>
  );
};

export default SectionEditor;
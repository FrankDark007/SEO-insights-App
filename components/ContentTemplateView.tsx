import React, { useState } from "react";
import { ContentTemplate } from "../types";
import { Copy, Check, FileText, Image, Code, Link as LinkIcon } from 'lucide-react';

interface ContentTemplateViewProps {
  template: ContentTemplate;
}

const ContentTemplateView: React.FC<ContentTemplateViewProps> = ({ template }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const generateOutlineText = () => {
    let outline = `Title: ${template.suggestedTitle}\n\n`;
    outline += `Meta Description: ${template.suggestedMetaDescription}\n\n`;
    outline += `Target Word Count: ${template.recommendedWordCount}\n\n`;
    outline += "CONTENT OUTLINE:\n";
    outline += "================\n\n";

    template.outlineHeadings.forEach((heading) => {
      const indent = heading.tag === "h1" ? "" : heading.tag === "h2" ? "  " : "    ";
      outline += `${indent}[${heading.tag.toUpperCase()}] ${heading.text}\n`;
      outline += `${indent}Target: ${heading.suggestedWordCount} words\n`;
      heading.keyPoints.forEach((point) => {
        outline += `${indent}  • ${point}\n`;
      });
      outline += "\n";
    });

    outline += "\nREQUIRED MEDIA:\n";
    template.requiredMedia.forEach((media) => {
      outline += `  • ${media}\n`;
    });

    outline += "\nREQUIRED SCHEMA:\n";
    template.requiredSchema.forEach((schema) => {
      outline += `  • ${schema}\n`;
    });

    outline += "\nINTERNAL LINK TARGETS:\n";
    template.internalLinkTargets.forEach((link) => {
      outline += `  • ${link}\n`;
    });

    return outline;
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📝 Optimized Content Template
        </h3>
        <button
          onClick={() => copyToClipboard(generateOutlineText(), "outline")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {copiedSection === "outline" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedSection === "outline" ? "Copied!" : "Copy Full Outline"}
        </button>
      </div>

      {/* Title & Meta */}
      <div className="space-y-4 mb-8">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Suggested Title ({template.suggestedTitle.length} chars)</p>
            <button
              onClick={() => copyToClipboard(template.suggestedTitle, "title")}
              className="text-indigo-400 hover:text-indigo-300 p-1"
            >
              {copiedSection === "title" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-white font-medium font-serif text-lg">{template.suggestedTitle}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">
              Suggested Meta ({template.suggestedMetaDescription.length} chars)
            </p>
            <button
              onClick={() => copyToClipboard(template.suggestedMetaDescription, "meta")}
              className="text-indigo-400 hover:text-indigo-300 p-1"
            >
              {copiedSection === "meta" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-gray-300 text-sm">{template.suggestedMetaDescription}</p>
        </div>

        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-indigo-400" />
          <p className="text-indigo-200 font-medium text-sm">
            Recommended Word Count: <span className="text-white font-bold">{template.recommendedWordCount.toLocaleString()} words</span>
          </p>
        </div>
      </div>

      {/* Outline */}
      <div className="mb-8">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Content Outline</h4>
        <div className="space-y-3">
          {template.outlineHeadings.map((heading, index) => {
            const indent = heading.tag === "h1" ? 0 : heading.tag === "h2" ? 1 : 2;
            const ml = indent === 1 ? "ml-6" : indent === 2 ? "ml-12" : "";
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg bg-gray-900/30 border border-gray-800 ${ml}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 uppercase">
                      {heading.tag}
                    </span>
                    <span className="text-white font-medium">{heading.text}</span>
                  </div>
                  <span className="text-gray-500 text-xs font-mono">{heading.suggestedWordCount} words</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 ml-9">
                  {heading.keyPoints.map((point, i) => (
                    <span key={i} className="text-xs bg-gray-800/50 text-gray-400 px-2 py-1 rounded border border-gray-700/50">
                      • {point}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Required Elements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/30 rounded-xl p-5 border border-gray-800">
          <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Image className="w-4 h-4" /> Required Media
          </h4>
          <ul className="space-y-2">
            {template.requiredMedia.map((media, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                {media}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900/30 rounded-xl p-5 border border-gray-800">
          <h4 className="text-violet-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" /> Required Schema
          </h4>
          <ul className="space-y-2">
            {template.requiredSchema.map((schema, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-violet-500 mt-0.5">•</span>
                {schema}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900/30 rounded-xl p-5 border border-gray-800">
          <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Internal Links
          </h4>
          <ul className="space-y-2">
            {template.internalLinkTargets.map((link, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2 break-all">
                <span className="text-blue-500 mt-0.5">•</span>
                {link}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentTemplateView;
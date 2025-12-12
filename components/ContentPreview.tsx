import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ContentPreviewProps {
  content: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-indigo max-w-none">
        <ReactMarkdown
            components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-gray-700" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-indigo-300 mt-8 mb-4 flex items-center gap-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-medium text-white mt-6 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 space-y-2 text-gray-300" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-gray-800/50 rounded-r text-gray-400 italic" {...props} />,
            }}
        >
            {content}
        </ReactMarkdown>
    </div>
  );
};

export default ContentPreview;
import React, { useState } from 'react';
import { generateBulkSchema } from '../services/richResultService';
import { GeneratedSchema, SchemaGenerationInput } from '../types';
import { Code, Loader2, Copy, Check, CheckCircle2 } from 'lucide-react';

const BulkSchemaGenerator: React.FC = () => {
  const [inputs, setInputs] = useState<SchemaGenerationInput[]>([
      {
          page: '/water-damage-arlington',
          city: 'Arlington, VA',
          schemaTypes: ['LocalBusiness', 'AggregateRating', 'BreadcrumbList'],
          businessInfo: { name: 'Flood Doctor', phone: '(703) 555-0123', address: '123 Main St, Arlington, VA', rating: 4.9, reviewCount: 87 }
      }
  ]);
  const [results, setResults] = useState<GeneratedSchema[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
      setIsLoading(true);
      try {
          const data = await generateBulkSchema(inputs);
          setResults(data);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const copyScript = (script: string, index: number) => {
      navigator.clipboard.writeText(script);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" /> Bulk Schema Generator
          </h3>
      </div>

      {!results ? (
          <div className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-sm text-gray-400">
                  <p>Ready to generate schema for {inputs.length} pages based on configured settings.</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                      {inputs.map((input, i) => (
                          <li key={i}><span className="text-white">{input.page}</span> ({input.schemaTypes.join(', ')})</li>
                      ))}
                  </ul>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate All Schema'}
              </button>
          </div>
      ) : (
          <div className="space-y-4">
              {results.map((res, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                      <div className="p-4 bg-gray-800/50 flex justify-between items-center">
                          <h4 className="font-bold text-white text-sm">{res.page}</h4>
                          <div className="flex items-center gap-2">
                              {res.validationStatus === 'valid' && <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Valid</span>}
                              <button 
                                onClick={() => copyScript(res.combinedScript, i)}
                                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              >
                                  {copiedIndex === i ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>}
                                  {copiedIndex === i ? 'Copied' : 'Copy Script'}
                              </button>
                          </div>
                      </div>
                      <div className="p-4 overflow-x-auto">
                          <pre className="text-xs text-gray-400 font-mono">{res.combinedScript}</pre>
                      </div>
                  </div>
              ))}
              <button 
                onClick={() => setResults(null)}
                className="text-sm text-gray-400 hover:text-white underline w-full text-center"
              >
                  Reset Generator
              </button>
          </div>
      )}
    </div>
  );
};

export default BulkSchemaGenerator;
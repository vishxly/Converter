import React, { useState } from 'react';

type ConversionMode = 'jsToJson' | 'jsToTs' | 'tsToJs' | 'jsonToJs';

const JSTSJSONConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('jsToJson');
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    try {
      switch (mode) {
        case 'jsToJson':
          setOutput(JSON.stringify(eval(`(${input})`), null, 2));
          break;
        case 'jsToTs':
          setOutput(convertJsToTs(input));
          break;
        case 'tsToJs':
          setOutput(convertTsToJs(input));
          break;
        case 'jsonToJs':
          setOutput(JSON.parse(input));
          break;
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred during conversion.');
      setOutput('');
    }
  };

  const convertJsToTs = (js: string): string => {
    // This is a basic conversion. For complex cases, you might need a more sophisticated parser.
    return js.replace(/var /g, 'let ')
             .replace(/function (\w+)/g, 'const $1 = (')
             .replace(/\) {/g, '): any => {')
             .replace(/(\w+): function/g, '$1: (')
             .replace(/: (\w+),/g, ': $1 as any,');
  };

  const convertTsToJs = (ts: string): string => {
    // This is a basic conversion. For complex cases, you might need a more sophisticated parser.
    return ts.replace(/let /g, 'var ')
             .replace(/const (\w+) = \(/g, 'function $1(')
             .replace(/\): \w+ =>/g, ') {')
             .replace(/(\w+): \(/g, '$1: function(')
             .replace(/: (\w+) as any,/g, ': $1,')
             .replace(/: any/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            mode === 'jsToJson' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setMode('jsToJson')}
        >
          JS to JSON
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            mode === 'jsToTs' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setMode('jsToTs')}
        >
          JS to TS
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            mode === 'tsToJs' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setMode('tsToJs')}
        >
          TS to JS
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            mode === 'jsonToJs' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setMode('jsonToJs')}
        >
          JSON to JS
        </button>
      </div>
      <div className="space-y-4">
        <textarea
          className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter ${mode.split('To')[0].toUpperCase()} code here`}
        />
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            onClick={handleConvert}
          >
            Convert
          </button>
        </div>
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <textarea
          className="w-full h-64 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
          value={output}
          readOnly
          placeholder={`${mode.split('To')[1].toUpperCase()} output will appear here`}
        />
      </div>
    </div>
  );
};

export default JSTSJSONConverter;
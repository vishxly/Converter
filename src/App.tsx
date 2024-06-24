import React, { useState } from 'react';
import Converter from './components/Converter';
import TSXConverter from './components/TSXConverter';
import SVGConverter from './components/SVGConverter';
import SVGToTSXConverter from './components/SVGToTSXConverter';
import CSSToTailwindConverter from './components/CSSToTailwindConverter';
import "./App.css";

type ConversionType = 'jsx' | 'tsx' | 'svg' | 'svgtsx' | 'tailwind';

const App: React.FC = () => {
  const [conversionType, setConversionType] = useState<ConversionType>('jsx');

  const converters = [
    { type: 'jsx', label: 'HTML to JSX' },
    { type: 'tsx', label: 'HTML to TSX' },
    { type: 'svg', label: 'SVG to JSX' },
    { type: 'svgtsx', label: 'SVG to TSX' },
    { type: 'tailwind', label: 'CSS to Tailwind' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-indigo-900 text-center mb-8">
          React Code Converter
        </h1>
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {converters.map(({ type, label }) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                    conversionType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setConversionType(type as ConversionType)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="transition-all duration-300 ease-in-out">
              {conversionType === 'jsx' && <Converter />}
              {conversionType === 'tsx' && <TSXConverter />}
              {conversionType === 'svg' && <SVGConverter />}
              {conversionType === 'svgtsx' && <SVGToTSXConverter />}
              {conversionType === 'tailwind' && <CSSToTailwindConverter />}
            </div>
          </div>
        </div>
        <footer className="mt-8 text-center text-gray-600">
          <p>Created with ❤️ using React and TypeScript</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
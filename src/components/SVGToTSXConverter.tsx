import React, { useState } from 'react';

const SVGToTSXConverter: React.FC = () => {
  const [svgInput, setSvgInput] = useState('');
  const [tsxOutput, setTsxOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convertSVGToTSX = (svg: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.documentElement;

      if (svgElement.tagName !== 'svg') {
        throw new Error('Invalid SVG input');
      }

      const tsxString = elementToTSX(svgElement);

      return `
import React from 'react';

interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {
  // You can add custom props here
}

const SVGComponent: React.FC<SVGComponentProps> = (props) => {
  return (
${tsxString}
  );
};

export default SVGComponent;
`.trim();
    } catch (err) {
      throw new Error('Failed to convert SVG to TSX: ' + (err as Error).message);
    }
  };

  const elementToTSX = (element: Element): string => {
    const tagName = element.tagName.toLowerCase();
    const attributes = Array.from(element.attributes)
      .map(attr => {
        const name = attr.name;
        const value = attr.value;
        
        const tsxName = name
          .replace(/^xlink:/, 'xlinkHref')
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase());

        if (value === '') return tsxName;

        if (name === 'style') {
          const styleObject = value.split(';').reduce((acc: Record<string, string>, style) => {
            const [key, value] = style.split(':').map(s => s.trim());
            if (key && value) {
              const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              acc[camelKey] = value;
            }
            return acc;
          }, {});
          return `style={${JSON.stringify(styleObject)} as React.CSSProperties}`;
        }

        return `${tsxName}="${value}"`;
      })
      .join(' ');

    const children = Array.from(element.childNodes)
      .map(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          return elementToTSX(child as Element);
        } else if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent?.trim();
          return text ? `{${JSON.stringify(text)}}` : '';
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');

    if (children) {
      return `<${tagName} ${attributes}>\n${children}\n</${tagName}>`;
    } else {
      return `<${tagName} ${attributes} />`;
    }
  };

  const handleConvert = () => {
    try {
      const tsxResult = convertSVGToTSX(svgInput);
      setTsxOutput(tsxResult);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setTsxOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="svgInput" className="block text-sm font-medium text-gray-700 mb-2">
          SVG Input
        </label>
        <textarea
          id="svgInput"
          className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          value={svgInput}
          onChange={(e) => setSvgInput(e.target.value)}
          placeholder="Paste your SVG code here"
        />
      </div>
      <div className="flex justify-center">
        <button
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          onClick={handleConvert}
        >
          Convert to TSX
        </button>
      </div>
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="tsxOutput" className="block text-sm font-medium text-gray-700 mb-2">
          TSX Output
        </label>
        <textarea
          id="tsxOutput"
          className="w-full h-64 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
          value={tsxOutput}
          readOnly
          placeholder="TSX output will appear here"
        />
      </div>
    </div>
  );
};

export default SVGToTSXConverter;
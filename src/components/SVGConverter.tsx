import React, { useState } from 'react';

const SVGConverter: React.FC = () => {
  const [svgInput, setSvgInput] = useState('');
  const [jsxOutput, setJsxOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convertSVGToJSX = (svg: string): string => {
    try {
      // Parse the SVG string
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.documentElement;

      if (svgElement.tagName !== 'svg') {
        throw new Error('Invalid SVG input');
      }

      // Convert SVG element to JSX
      const jsxString = elementToJSX(svgElement);

      // Wrap in a React component
      return `
import React from 'react';

const SVGComponent = (props) => {
  return (
${jsxString}
  );
};

export default SVGComponent;
`.trim();
    } catch (err) {
      throw new Error('Failed to convert SVG to JSX: ' + (err as Error).message);
    }
  };

  const elementToJSX = (element: Element): string => {
    const tagName = element.tagName.toLowerCase();
    const attributes = Array.from(element.attributes)
      .map(attr => {
        const name = attr.name;
        const value = attr.value;
        
        // Convert attribute names
        const jsxName = name
          .replace(/^xlink:/, 'xlinkHref')
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase());

        // Handle boolean attributes
        if (value === '') return jsxName;

        // Handle style attribute
        if (name === 'style') {
          const styleObject = value.split(';').reduce((acc: Record<string, string>, style) => {
            const [key, value] = style.split(':').map(s => s.trim());
            if (key && value) {
              const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              acc[camelKey] = value;
            }
            return acc;
          }, {});
          return `style={${JSON.stringify(styleObject)}}`;
        }

        return `${jsxName}="${value}"`;
      })
      .join(' ');

    const children = Array.from(element.childNodes)
      .map(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          return elementToJSX(child as Element);
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
      const jsxResult = convertSVGToJSX(svgInput);
      setJsxOutput(jsxResult);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setJsxOutput('');
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
          Convert to JSX
        </button>
      </div>
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="jsxOutput" className="block text-sm font-medium text-gray-700 mb-2">
          JSX Output
        </label>
        <textarea
          id="jsxOutput"
          className="w-full h-64 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
          value={jsxOutput}
          readOnly
          placeholder="JSX output will appear here"
        />
      </div>
    </div>
  );
};

export default SVGConverter;
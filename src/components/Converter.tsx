import React, { useState } from 'react';
import { Parser } from 'html-to-react';

interface ReactElement {
  type: string;
  props: {
    children?: ReactElement | ReactElement[] | string;
    [key: string]: any;
  };
}

const Converter: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [jsxOutput, setJsxOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const simpleFormat = (jsx: string): string => {
    return jsx
      .replace(/^\s+|\s+$/g, '')
      .replace(/>\s+</g, '>\n<')
      .replace(/([^>])\s+</g, '$1\n<')
      .split('\n')
      .map(line => '  ' + line.trim())
      .join('\n');
  };

  const handleConvert = () => {
    try {
      if (typeof DOMParser === 'undefined') {
        throw new Error('DOMParser is not available in this environment.');
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, 'text/html');

      if (doc.body.innerHTML.trim() === '') {
        throw new Error('Invalid HTML input.');
      }

      const bodyContent = doc.body.innerHTML;

      const htmlToReactParser = new Parser();
      const reactElement = htmlToReactParser.parse(bodyContent);

      const generateJSX = (element: ReactElement | string): string => {
        if (typeof element === 'string') {
          return element;
        }

        if (element.type === 'comment') {
          return `{/* ${(element as any).data.trim()} */}`;
        }

        const { type, props } = element;
        const children = props.children
          ? Array.isArray(props.children)
            ? props.children.map(child => generateJSX(child as ReactElement | string)).join('')
            : generateJSX(props.children as ReactElement | string)
          : '';

        const jsxProps = Object.entries(props)
          .filter(([key]) => key !== 'children')
          .map(([key, value]) => {
            if (key === 'class') return `className="${value}"`;
            if (key === 'for') return `htmlFor="${value}"`;
            if (key === 'style') {
              const styleString = Object.entries(value as object)
                .map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `"${v}"`}`)
                .join(', ');
              return `style={{ ${styleString} }}`;
            }
            if (typeof value === 'boolean') {
              return value ? key : '';
            }
            return `${key}="${value}"`;
          })
          .filter(Boolean)
          .join(' ');

        return `<${type}${jsxProps ? ' ' + jsxProps : ''}>${children}</${type}>`;
      };

      const jsxString = Array.isArray(reactElement)
        ? reactElement.map(el => generateJSX(el as ReactElement)).join('')
        : generateJSX(reactElement as ReactElement);

      const formattedJSX = simpleFormat(`<>${jsxString}</>`);

      setJsxOutput(formattedJSX);
      setError(null);
    } catch (err) {
      setError((err as Error).message || 'An error occurred during conversion.');
      setJsxOutput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          HTML to JSX Converter
        </h1>
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="htmlInput" className="block text-sm font-medium text-gray-700 mb-2">
                HTML Input
              </label>
              <textarea
                id="htmlInput"
                className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Enter HTML code here"
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
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="mt-6">
              <label htmlFor="jsxOutput" className="block text-sm font-medium text-gray-700 mb-2">
                JSX Output
              </label>
              <textarea
                id="jsxOutput"
                className="w-full h-64 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                value={jsxOutput}
                readOnly
                placeholder="JSX output will appear here"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
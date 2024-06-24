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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">HTML to JSX Converter</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={10}
        value={htmlInput}
        onChange={(e) => setHtmlInput(e.target.value)}
        placeholder="Enter HTML code here"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleConvert}
      >
        Convert to JSX
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <textarea
        className="w-full p-2 border rounded mt-4"
        rows={10}
        value={jsxOutput}
        readOnly
        placeholder="JSX output will appear here"
      />
    </div>
  );
};

export default Converter;
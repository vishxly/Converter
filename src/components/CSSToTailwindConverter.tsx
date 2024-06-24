import React, { useState } from 'react';

const CSSToTailwindConverter: React.FC = () => {
  const [cssInput, setCssInput] = useState('');
  const [tailwindOutput, setTailwindOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convertCSSToTailwind = (css: string): string => {
    const rules: { [key: string]: string } = {};
    const lines = css.split(';').map(line => line.trim());

    lines.forEach(line => {
      const [property, value] = line.split(':').map(part => part.trim());
      if (property && value) {
        rules[property] = value;
      }
    });

    const tailwindClasses: string[] = [];

    Object.entries(rules).forEach(([property, value]) => {
      switch (property) {
        case 'margin':
          tailwindClasses.push(`m-${value.replace('px', '')}`);
          break;
        case 'margin-top':
          tailwindClasses.push(`mt-${value.replace('px', '')}`);
          break;
        case 'margin-right':
          tailwindClasses.push(`mr-${value.replace('px', '')}`);
          break;
        case 'margin-bottom':
          tailwindClasses.push(`mb-${value.replace('px', '')}`);
          break;
        case 'margin-left':
          tailwindClasses.push(`ml-${value.replace('px', '')}`);
          break;
        case 'padding':
          tailwindClasses.push(`p-${value.replace('px', '')}`);
          break;
        case 'padding-top':
          tailwindClasses.push(`pt-${value.replace('px', '')}`);
          break;
        case 'padding-right':
          tailwindClasses.push(`pr-${value.replace('px', '')}`);
          break;
        case 'padding-bottom':
          tailwindClasses.push(`pb-${value.replace('px', '')}`);
          break;
        case 'padding-left':
          tailwindClasses.push(`pl-${value.replace('px', '')}`);
          break;
        case 'font-size':
          tailwindClasses.push(`text-${value.replace('px', '')}`);
          break;
        case 'font-weight':
          tailwindClasses.push(`font-${value}`);
          break;
        case 'text-align':
          tailwindClasses.push(`text-${value}`);
          break;
        case 'color':
          tailwindClasses.push(`text-${value}`);
          break;
        case 'background-color':
          tailwindClasses.push(`bg-${value}`);
          break;
        case 'width':
          if (value.endsWith('%')) {
            tailwindClasses.push(`w-${parseInt(value)}/${100}`);
          } else {
            tailwindClasses.push(`w-${value.replace('px', '')}`);
          }
          break;
        case 'height':
          if (value.endsWith('%')) {
            tailwindClasses.push(`h-${parseInt(value)}/${100}`);
          } else {
            tailwindClasses.push(`h-${value.replace('px', '')}`);
          }
          break;
        case 'display':
          tailwindClasses.push(value);
          break;
        case 'flex-direction':
          tailwindClasses.push(`flex-${value}`);
          break;
        case 'justify-content':
          tailwindClasses.push(`justify-${value.replace('flex-', '')}`);
          break;
        case 'align-items':
          tailwindClasses.push(`items-${value}`);
          break;
        default:
          tailwindClasses.push(`[${property}:${value}]`);
      }
    });

    return tailwindClasses.join(' ');
  };

  const handleConvert = () => {
    try {
      const tailwindResult = convertCSSToTailwind(cssInput);
      setTailwindOutput(tailwindResult);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setTailwindOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="cssInput" className="block text-sm font-medium text-gray-700 mb-2">
          CSS Input
        </label>
        <textarea
          id="cssInput"
          className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          value={cssInput}
          onChange={(e) => setCssInput(e.target.value)}
          placeholder="Paste your CSS code here (one declaration per line)"
        />
      </div>
      <div className="flex justify-center">
        <button
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          onClick={handleConvert}
        >
          Convert to Tailwind CSS
        </button>
      </div>
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="tailwindOutput" className="block text-sm font-medium text-gray-700 mb-2">
          Tailwind CSS Output
        </label>
        <textarea
          id="tailwindOutput"
          className="w-full h-64 p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
          value={tailwindOutput}
          readOnly
          placeholder="Tailwind CSS classes will appear here"
        />
      </div>
    </div>
  );
};

export default CSSToTailwindConverter;
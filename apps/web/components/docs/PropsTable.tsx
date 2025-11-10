import React from 'react';

interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

interface PropsTableProps {
  props: PropDefinition[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white/5 border-y border-white/10">
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">
              Property
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">
              Type
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">
              Default
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={`border-b border-white/10 ${
                index % 2 === 0 ? 'bg-white/[0.02]' : ''
              }`}
            >
              <td className="px-4 py-3">
                <code className="text-purple-400 font-mono text-sm">
                  {prop.name}
                  {prop.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </code>
              </td>
              <td className="px-4 py-3">
                <code className="text-blue-400 font-mono text-xs bg-white/5 px-2 py-1 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3">
                {prop.default ? (
                  <code className="text-green-400 font-mono text-xs bg-white/5 px-2 py-1 rounded">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-gray-500 text-sm">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

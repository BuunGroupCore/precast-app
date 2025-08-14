import { motion } from "framer-motion";

interface PropInfo {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  title?: string;
  props: PropInfo[];
  className?: string;
}

/**
 * Documentation component for displaying component props in a table format.
 * Shows prop names, types, defaults, and descriptions with required indicators.
 */
export function PropsTable({ title = "Props", props, className = "" }: PropsTableProps) {
  return (
    <div className={`comic-panel bg-white p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h4 className="font-display text-xl text-comic-black mb-2">{title}</h4>
        <p className="font-comic text-sm text-gray-600">
          Complete API reference for component properties
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-comic-black">
              <th className="text-left font-comic font-bold py-3 px-2">Name</th>
              <th className="text-left font-comic font-bold py-3 px-2">Type</th>
              <th className="text-left font-comic font-bold py-3 px-2">Default</th>
              <th className="text-left font-comic font-bold py-3 px-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line react/prop-types */}
            {props.map((prop, index) => (
              <motion.tr
                key={prop.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {/* Name */}
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-bold text-comic-blue bg-blue-50 px-2 py-1 rounded">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="text-red-500 text-xs font-bold" title="Required">
                        *
                      </span>
                    )}
                  </div>
                </td>

                {/* Type */}
                <td className="py-4 px-2">
                  <code className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {prop.type}
                  </code>
                </td>

                {/* Default */}
                <td className="py-4 px-2">
                  {prop.default ? (
                    <code className="font-mono text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                      {prop.default}
                    </code>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>

                {/* Description */}
                <td className="py-4 px-2">
                  <p className="font-comic text-sm text-gray-700">{prop.description}</p>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="font-comic text-xs text-gray-500">
          <span className="text-red-500 font-bold">*</span> Required props
        </p>
      </div>
    </div>
  );
}

export default PropsTable;

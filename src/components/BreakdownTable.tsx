import React from "react";

export interface BreakdownColumn {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
}

export interface BreakdownRow {
  id: string | number;
  cells: Record<string, string | number | React.ReactNode>;
  isHighlighted?: boolean;
}

interface BreakdownTableProps {
  title?: string;
  subtitle?: string;
  columns: BreakdownColumn[];
  rows: BreakdownRow[];
  totalLabel?: string;
  totalValue?: string;
  emptyMessage?: string;
  className?: string;
}

export default function BreakdownTable({
  title = "Detailed Calculation Breakdown",
  subtitle,
  columns,
  rows,
  totalLabel,
  totalValue,
  emptyMessage = "No breakdown available for this input.",
  className = "",
}: BreakdownTableProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-appBorder pb-2">
          {title && <h3 className="text-base font-bold text-primary">{title}</h3>}
          {subtitle && <p className="text-xs text-appText-muted">{subtitle}</p>}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="p-4 bg-surface rounded-md text-sm text-appText-muted text-center">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-appBorder bg-white shadow-xs">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-surface text-appText font-semibold border-b border-appBorder text-xs uppercase tracking-wider">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`py-3 px-3 sm:px-4 ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-appBorder">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    row.isHighlighted
                      ? "bg-accent-soft/60 font-medium"
                      : "hover:bg-surface/50"
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm text-appText ${
                        col.align === "right"
                          ? "text-right font-mono"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {row.cells[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {totalValue && (
              <tfoot className="bg-surface font-bold text-primary border-t-2 border-appBorder">
                <tr>
                  <td
                    colSpan={Math.max(1, columns.length - 1)}
                    className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm uppercase tracking-wider"
                  >
                    {totalLabel || "Total"}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-sm sm:text-base text-accent">
                    {totalValue}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}

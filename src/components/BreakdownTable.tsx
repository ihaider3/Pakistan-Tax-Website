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
    <div className={`space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-slate-200/80 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            {title && <h3 className="text-lg font-black text-primary tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-appText-muted mt-0.5">{subtitle}</p>}
          </div>
          <span className="text-[11px] font-bold text-accent bg-accent-soft px-2.5 py-0.5 rounded-full border border-accent/20 self-start sm:self-auto">
            Line-by-Line Math
          </span>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="p-6 bg-surface rounded-xl text-sm text-appText-muted text-center font-medium border border-slate-200/80">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_25px_-5px_rgba(11,42,74,0.05)]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gradient-to-r from-surface via-slate-100 to-surface text-primary font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`py-3.5 px-4 sm:px-5 ${
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
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors duration-150 ${
                    row.isHighlighted
                      ? "bg-teal-50/70 font-semibold"
                      : "hover:bg-slate-50/70"
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 px-4 sm:px-5 text-xs sm:text-sm text-appText ${
                        col.align === "right"
                          ? "text-right font-mono font-medium"
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
              <tfoot className="bg-gradient-to-r from-surface via-slate-100/90 to-surface font-black text-primary border-t-2 border-slate-200">
                <tr>
                  <td
                    colSpan={Math.max(1, columns.length - 1)}
                    className="py-4 px-4 sm:px-5 text-left text-xs sm:text-sm uppercase tracking-wider font-extrabold text-primary"
                  >
                    {totalLabel || "Total"}
                  </td>
                  <td className="py-4 px-4 sm:px-5 text-right font-mono text-base sm:text-lg text-accent font-black">
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

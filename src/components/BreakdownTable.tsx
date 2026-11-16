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
        <>
          {/* =========================================================================
              MOBILE VIEW (< sm / 360px): Stacked Cards (Option A Preferred)
              Converts each row into an easy-to-read vertical card. No horizontal squeeze.
             ========================================================================= */}
          <div className="block sm:hidden space-y-3" aria-label="Mobile calculation breakdown">
            {rows.map((row, rIdx) => {
              const firstCol = columns[0];
              const remainingCols = columns.slice(1);
              return (
                <div
                  key={row.id || rIdx}
                  className={`p-4 rounded-xl border transition-all ${
                    row.isHighlighted
                      ? "bg-teal-50/70 border-accent/40 shadow-xs ring-1 ring-accent/20"
                      : "bg-white border-slate-200/90 shadow-2xs"
                  }`}
                >
                  {/* First column as card title / subject */}
                  {firstCol && (
                    <div className="pb-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
                      <div className="font-bold text-primary text-sm leading-snug">
                        {row.cells[firstCol.key]}
                      </div>
                      {row.isHighlighted && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-accent text-white shrink-0">
                          Applied
                        </span>
                      )}
                    </div>
                  )}

                  {/* Remaining columns as key-value pairs */}
                  <div className="space-y-2 text-xs">
                    {remainingCols.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-slate-500 font-medium">
                          {col.header}:
                        </span>
                        <div
                          className={`font-semibold text-right ${
                            col.align === "right" ? "font-mono text-slate-900" : "text-appText"
                          }`}
                        >
                          {row.cells[col.key]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Mobile Total Card */}
            {totalValue && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-teal-50/40 to-slate-50 border-2 border-[#0B2A4A] flex items-center justify-between gap-3 shadow-xs">
                <span className="font-extrabold text-xs uppercase tracking-wider text-primary">
                  {totalLabel || "Total"}
                </span>
                <span className="font-mono text-base font-black text-accent">
                  {totalValue}
                </span>
              </div>
            )}
          </div>

          {/* =========================================================================
              TABLET & DESKTOP VIEW (>= sm / 640px & 768px+ & 1280px): Full Table
              Wrapped in self-contained overflow card so the page never scrolls sideways.
             ========================================================================= */}
          <div className="hidden sm:block">
            {columns.length >= 4 && (
              <div className="block lg:hidden text-[11px] text-slate-500 font-medium italic pb-1.5 flex items-center gap-1">
                <span>Swipe → to view all columns</span>
              </div>
            )}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_25px_-5px_rgba(11,42,74,0.05)]">
              <table className="w-full text-left text-sm border-collapse min-w-[500px]">
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
          </div>
        </>
      )}
    </div>
  );
}

import React from "react";

type Props = {
  offsetHeight: number | undefined;
  gridStopsPerDay: number;
  children: React.ReactNode;
  zIndex?: number;
};

export const SchedulerColumns = function SchedulerColumns(
  {
    ref,
    offsetHeight,
    gridStopsPerDay,
    children,
    zIndex
  }: Props & {
    ref: React.RefObject<HTMLOListElement>;
  }
) {
  return (
    <ol
      ref={ref}
      className="scheduler-grid-row-template col-start-1 col-end-2 row-start-1 grid auto-cols-auto text-[0px] sm:pr-8"
      style={{ marginTop: offsetHeight || "var(--gridDefaultSize)", zIndex }}
      data-gridstopsperday={gridStopsPerDay}>
      {children}
    </ol>
  );
};

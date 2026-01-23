import React, { memo, useMemo, useCallback } from "react";
import Pagination, { PaginationProps } from "../Pagination";
import { theme } from "../../theme";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  hoverable?: boolean;
  pagination?: PaginationProps;
}

const containerStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.colors.gray[200]}`,
  overflow: "hidden",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  width: "100%",
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: "center",
  padding: `${theme.spacing["3xl"]} ${theme.spacing["2xl"]}`,
  color: theme.colors.gray[500],
  fontSize: theme.typography.fontSize.base,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadRowStyle: React.CSSProperties = {
  background: theme.colors.gray[50],
  borderBottom: `1px solid ${theme.colors.gray[200]}`,
};

const thStyle: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontWeight: theme.typography.fontWeight.semibold,
  fontSize: theme.typography.fontSize.xs,
  color: theme.colors.gray[500],
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const trStyle: React.CSSProperties = {
  borderBottom: `1px solid ${theme.colors.gray[200]}`,
  transition: theme.transitions.fast,
};

const tdStyle: React.CSSProperties = {
  padding: `${theme.spacing.md} ${theme.spacing.md}`,
  color: theme.colors.gray[900],
  fontSize: theme.typography.fontSize.sm,
};

// Memoized table row component
interface TableRowProps<T> {
  item: T;
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  hoverable: boolean;
}

function TableRowInner<T>({
  item,
  columns,
  keyExtractor,
  onRowClick,
  hoverable,
}: TableRowProps<T>) {
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => {
      if (hoverable) {
        e.currentTarget.style.background = theme.colors.gray[50];
      }
    },
    [hoverable],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => {
      if (hoverable) {
        e.currentTarget.style.background = "transparent";
      }
    },
    [hoverable],
  );

  const handleClick = useCallback(() => {
    onRowClick?.(item);
  }, [onRowClick, item]);

  return (
    <tr
      key={keyExtractor(item)}
      onClick={handleClick}
      style={{
        ...trStyle,
        cursor: onRowClick ? "pointer" : "default",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          style={{
            ...tdStyle,
            textAlign: column.align || "left",
          }}
        >
          {column.render(item)}
        </td>
      ))}
    </tr>
  );
}

const TableRow = memo(TableRowInner) as typeof TableRowInner;

function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "Kayıt bulunamadı",
  onRowClick,
  hoverable = true,
  pagination,
}: TableProps<T>) {
  // Memoize empty state check
  const isEmpty = useMemo(() => data.length === 0, [data.length]);

  // Memoize column headers
  const headerCells = useMemo(
    () =>
      columns.map((column) => (
        <th
          key={column.key}
          style={{
            ...thStyle,
            textAlign: column.align || "left",
            width: column.width,
          }}
        >
          {column.header}
        </th>
      )),
    [columns],
  );

  return (
    <>
      <div style={containerStyle}>
        {isEmpty ? (
          <div style={emptyStateStyle}>{emptyMessage}</div>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={theadRowStyle}>{headerCells}</tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <TableRow
                    key={keyExtractor(item)}
                    item={item}
                    columns={columns}
                    keyExtractor={keyExtractor}
                    onRowClick={onRowClick}
                    hoverable={hoverable}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && !isEmpty && <Pagination {...pagination} />}
    </>
  );
}

export default memo(Table) as typeof Table;

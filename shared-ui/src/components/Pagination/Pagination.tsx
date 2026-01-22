import React, { memo, useMemo, useCallback } from "react";
import { theme } from "../../theme";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showInfo?: boolean;
  maxVisiblePages?: number;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.md,
  alignItems: "center",
  justifyContent: "center",
  marginTop: "1.5rem",
  padding: "1rem 0",
};

const infoStyle: React.CSSProperties = {
  fontSize: theme.typography.fontSize.sm,
  color: theme.colors.gray[500],
};

const paginationStyle: React.CSSProperties = {
  display: "flex",
  gap: theme.spacing.sm,
  alignItems: "center",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "2.5rem",
  height: "2.5rem",
  padding: "0 0.75rem",
  fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.medium,
  color: theme.colors.gray[700],
  backgroundColor: "#ffffff",
  border: `1px solid ${theme.colors.gray[200]}`,
  borderRadius: theme.borderRadius.lg,
  cursor: "pointer",
  transition: theme.transitions.base,
  userSelect: "none",
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  color: "#ffffff",
  backgroundColor: theme.colors.primary[500],
  borderColor: theme.colors.primary[500],
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.5,
  cursor: "not-allowed",
};

const ellipsisStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "2.5rem",
  height: "2.5rem",
  color: theme.colors.gray[400],
  fontSize: theme.typography.fontSize.sm,
  userSelect: "none",
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showInfo = true,
  maxVisiblePages = 5,
}) => {
  // Memoize page numbers calculation
  const pageNumbers = useMemo((): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // Memoize callbacks
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Memoize item range
  const { startItem, endItem } = useMemo(() => {
    const start =
      totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end =
      totalItems && itemsPerPage
        ? Math.min(currentPage * itemsPerPage, totalItems)
        : 0;
    return { startItem: start, endItem: end };
  }, [currentPage, totalItems, itemsPerPage]);

  if (totalPages <= 1) return null;

  return (
    <div style={containerStyle}>
      {showInfo && totalItems && itemsPerPage && (
        <div style={infoStyle}>
          <span style={{ fontWeight: 500, color: theme.colors.gray[700] }}>
            {startItem}-{endItem}
          </span>{" "}
          arası gösteriliyor (Toplam:{" "}
          <span style={{ fontWeight: 500, color: theme.colors.gray[700] }}>
            {totalItems}
          </span>
          )
        </div>
      )}

      <div style={paginationStyle}>
        <button
          style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Önceki sayfa"
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = theme.colors.gray[50];
              e.currentTarget.style.borderColor = theme.colors.gray[300];
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = theme.colors.gray[200];
            }
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === "number" ? (
              <button
                style={page === currentPage ? activeButtonStyle : buttonStyle}
                onClick={() => onPageChange(page)}
                aria-label={`Sayfa ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                onMouseEnter={(e) => {
                  if (page === currentPage) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.primary[600];
                  } else {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.gray[50];
                    e.currentTarget.style.borderColor = theme.colors.gray[300];
                  }
                }}
                onMouseLeave={(e) => {
                  if (page === currentPage) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.primary[500];
                  } else {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = theme.colors.gray[200];
                  }
                }}
              >
                {page}
              </button>
            ) : (
              <span style={ellipsisStyle}>{page}</span>
            )}
          </React.Fragment>
        ))}

        <button
          style={currentPage === totalPages ? disabledButtonStyle : buttonStyle}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Sonraki sayfa"
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = theme.colors.gray[50];
              e.currentTarget.style.borderColor = theme.colors.gray[300];
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = theme.colors.gray[200];
            }
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(Pagination);

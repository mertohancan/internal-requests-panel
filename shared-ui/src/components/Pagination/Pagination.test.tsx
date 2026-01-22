import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("does not render when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders pagination buttons correctly", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByLabelText("Önceki sayfa")).toBeInTheDocument();
    expect(screen.getByLabelText("Sonraki sayfa")).toBeInTheDocument();
    expect(screen.getByLabelText("Sayfa 1")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByLabelText("Önceki sayfa")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByLabelText("Sonraki sayfa")).toBeDisabled();
  });

  it("calls onPageChange when page button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByLabelText("Sayfa 2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("shows info text when showInfo is true and totalItems provided", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
        totalItems={50}
        itemsPerPage={10}
        showInfo={true}
      />,
    );
    expect(screen.getByText(/Toplam/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it("renders ellipsis for large page numbers", () => {
    const { container } = render(
      <Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />,
    );
    const ellipsis = Array.from(container.querySelectorAll("span")).find(
      (el) => el.textContent === "...",
    );
    expect(ellipsis).toBeInTheDocument();
  });
});

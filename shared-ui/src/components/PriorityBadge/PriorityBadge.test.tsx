import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PriorityBadge from "./PriorityBadge";

describe("PriorityBadge", () => {
  it("renders low priority correctly", () => {
    render(<PriorityBadge priority="low" />);
    expect(screen.getByText("Düşük")).toBeInTheDocument();
  });

  it("renders normal priority correctly", () => {
    render(<PriorityBadge priority="normal" />);
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });

  it("renders high priority correctly", () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText("Yüksek")).toBeInTheDocument();
  });

  it("renders urgent priority correctly", () => {
    render(<PriorityBadge priority="urgent" />);
    expect(screen.getByText("Acil")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders pending status correctly", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("Bekliyor")).toBeInTheDocument();
  });

  it("renders approved status correctly", () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText("Onaylandı")).toBeInTheDocument();
  });

  it("renders rejected status correctly", () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText("Reddedildi")).toBeInTheDocument();
  });
});

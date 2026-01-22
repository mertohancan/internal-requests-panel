import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders with correct text", () => {
    render(<Badge color="#3b82f6">Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("applies the correct background color", () => {
    render(<Badge color="#ef4444">Red Badge</Badge>);
    const badge = screen.getByText("Red Badge");
    expect(badge).toHaveStyle({ background: "#ef4444" });
  });

  it("renders children correctly", () => {
    render(
      <Badge color="#10b981">
        <span>Complex Child</span>
      </Badge>,
    );
    expect(screen.getByText("Complex Child")).toBeInTheDocument();
  });
});

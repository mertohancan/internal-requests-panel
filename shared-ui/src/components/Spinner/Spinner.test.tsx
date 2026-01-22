import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  it("renders without crashing", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has animation keyframes", () => {
    const { container } = render(<Spinner />);
    const style = container.querySelector("style");
    expect(style?.textContent).toContain("@keyframes spin");
  });
});

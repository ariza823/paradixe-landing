import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { EasterEgg } from "@layout/footer/EasterEgg.tsx";

describe("EasterEgg", () => {
  it("aparece al llegar al fondo y se esconde al subir", () => {
    let notify: IntersectionObserverCallback = () => undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          notify = callback;
        }
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    const intersect = (isIntersecting: boolean) =>
      act(() => notify([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));

    render(<EasterEgg />);
    const egg = screen.getByTestId("easter-egg");
    expect(egg).toHaveClass("opacity-0");

    intersect(true);
    expect(egg).toHaveClass("opacity-100");

    intersect(false);
    expect(egg).toHaveClass("opacity-0");
    vi.unstubAllGlobals();
  });
});

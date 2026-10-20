import { act, renderHook } from "@testing-library/react";
import { getCountdown, useCountdown } from "@core/hooks/useCountdown.ts";

describe("getCountdown", () => {
  it("descompone la diferencia en días, horas, minutos y segundos", () => {
    const diff = ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
    expect(getCountdown(diff, 0)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      isOver: false,
    });
  });

  it("marca isOver cuando la fecha ya pasó", () => {
    expect(getCountdown(0, 1000).isOver).toBe(true);
  });
});

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-15T18:59:58-05:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("cambia a isOver al llegar la fecha y deja de contar", () => {
    const { result } = renderHook(() => useCountdown("2026-11-15T19:00:00-05:00"));
    expect(result.current.isOver).toBe(false);
    expect(result.current.seconds).toBe(2);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isOver).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
});

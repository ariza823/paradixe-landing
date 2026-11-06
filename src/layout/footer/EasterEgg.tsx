import { useEffect, useRef, useState } from "react";
import easterEgg from "@assets/images/easter-egg.webp";

export function EasterEgg() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      threshold: 0.6,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="grid h-[70dvh] place-content-center overflow-hidden px-4">
      <div
        data-testid="easter-egg"
        className={`motion-safe:transition-[translate,opacity] motion-safe:duration-700 motion-safe:ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <img src={easterEgg} alt="" loading="lazy" width={740} height={865} className="h-[62dvh] w-auto max-w-full" />
      </div>
    </div>
  );
}

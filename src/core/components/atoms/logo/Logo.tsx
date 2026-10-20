type LogoSize = "hero" | "footer";
type PillTone = "sky" | "gold";

interface LogoProps {
  readonly as?: "h1" | "div";
  readonly size?: LogoSize;
  readonly pill?: string;
  readonly pillTone?: PillTone;
}

const scriptClasses: Record<LogoSize, string> = {
  hero: "text-[clamp(80px,26vw,220px)] px-[0.15em] pb-[0.08em]",
  footer: "text-[72px] px-[0.15em] pb-[0.08em]",
};

const pillClasses: Record<LogoSize, string> = {
  hero: "-mt-[0.35em] px-[0.6em] py-[0.1em] text-[32px] lg:text-[56px]",
  footer: "-mt-3 px-3 py-0.5 text-[18px]",
};

const pillToneClasses: Record<PillTone, string> = {
  sky: "",
  gold: "bg-accent-gold! text-surface! dark:text-on-accent!",
};

export function Logo({ as: Tag = "div", size = "hero", pill = "Urban", pillTone = "sky" }: LogoProps) {
  return (
    <Tag className="m-0 flex flex-col items-center font-normal">
      <span className={`chrome-script block ${scriptClasses[size]}`}>Paradixe</span>{" "}
      <span className={`pill-urban ${pillClasses[size]} ${pillToneClasses[pillTone]}`}>{pill}</span>
    </Tag>
  );
}

export function LogoMark() {
  return (
    <span aria-hidden="true" className="chrome-script block px-1 text-[40px]">
      P
    </span>
  );
}

interface BarbedWireProps {
  readonly addStyle?: string;
}

export function BarbedWire({ addStyle = "" }: BarbedWireProps) {
  return (
    <svg
      viewBox="0 0 900 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={`text-accent-lilac ${addStyle}`.trim()}
    >
      <path d="M20 60 C 120 10, 200 110, 300 60 S 480 10, 450 60 S 600 110, 700 60 S 820 10, 880 60" />
      <path d="M60 52 l 10 -16 M140 44 l 8 -18 M240 82 l 10 16 M560 82 l 10 16 M660 44 l 8 -18 M780 52 l 10 -16" />
    </svg>
  );
}

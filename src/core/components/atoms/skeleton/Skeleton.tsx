interface SkeletonProps {
  readonly addStyle?: string;
}

export function Skeleton({ addStyle = "" }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-surface-soft motion-safe:animate-pulse ${addStyle}`.trim()}
    />
  );
}

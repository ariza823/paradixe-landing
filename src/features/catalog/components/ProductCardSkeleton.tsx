import { Skeleton } from "@atoms/skeleton/Skeleton.tsx";

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col border border-line bg-surface">
      <Skeleton addStyle="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-4 p-5">
        <Skeleton addStyle="h-5 w-2/3" />
        <Skeleton addStyle="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton addStyle="h-11 w-11 rounded-full" />
          <Skeleton addStyle="h-11 w-11 rounded-full" />
          <Skeleton addStyle="h-11 w-11 rounded-full" />
        </div>
        <Skeleton addStyle="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

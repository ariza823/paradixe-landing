import { Skeleton } from "@atoms/skeleton/Skeleton.tsx";

export function ProductCardSkeleton() {
  return (
    <div className="ticket-card flex h-full flex-col">
      <Skeleton addStyle="aspect-[4/5] w-full rounded-t-[22px]" />
      <div className="ticket-stub flex flex-col gap-4 p-5">
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

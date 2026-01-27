interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse bg-secondary-200 rounded ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="flex flex-col">
    <Skeleton className="aspect-[3/4] w-full mb-4" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-5 w-1/3" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full" />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-24" />
      </div>
      <Skeleton className="h-14 w-full" />
    </div>
  </div>
);

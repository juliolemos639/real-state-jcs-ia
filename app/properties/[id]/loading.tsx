export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Skeleton */}
                <div className="mb-6">
                    <div className="h-8 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-1/2 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                </div>

                {/* Image Skeleton */}
                <div className="mb-8">
                    <div className="w-full h-96 bg-muted rounded-lg animate-pulse"></div>
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="h-6 bg-muted rounded w-1/2 mb-4 animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                        </div>
                        <div className="mt-6">
                            <div className="h-5 bg-muted rounded w-1/3 mb-2 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="h-6 bg-muted rounded w-1/2 mb-4 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-full mb-4 animate-pulse"></div>
                        <div className="bg-muted p-4 rounded-lg">
                            <div className="h-4 bg-background rounded w-3/4 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
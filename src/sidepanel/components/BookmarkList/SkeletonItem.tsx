export const SkeletonItem = () => {
    return (
        <div className="animate-pulse flex space-x-4 p-4">
            <div className="rounded-md bg-gray-300 h-10 w-10 shrink-0" />
            <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="space-y-1">
                    <div className="h-4 bg-gray-300 rounded w-5/6" />
                </div>
            </div>
        </div>
    );
};

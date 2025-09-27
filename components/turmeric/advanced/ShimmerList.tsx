"use client";
type Props = {
    count?: number;
    className?: string;
    rowClassName?: string;
};

export default function ShimmerList({
    count = 5,
    className = '',
    rowClassName = 'h-14 rounded-xl mx-1 my-1',
    }: Props) {
    return (
        <div role="status" aria-live="polite" aria-busy="true" className={className}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={`turmeric-skeleton ${rowClassName}`} aria-hidden="true" />
            ))}
        <span className="sr-only">Loading...</span>
        </div>
    );
}
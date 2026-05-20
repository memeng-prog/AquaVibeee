import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export function StarRating({ rating, reviewCount, size = 'sm' }: StarRatingProps) {
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={iconSize}
            className={cn(
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-ocean-100 text-ocean-200',
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-ocean-700">{rating.toFixed(1)}</span>
      {reviewCount != null && (
        <span className="text-sm text-ocean-500">({reviewCount})</span>
      )}
    </div>
  )
}

// RatingStars.tsx

import React from "react";
import "./RatingStars.scss";

interface RatingStarsProps {
    averageRating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ averageRating }) => {
    // Calculate the fill percentage for each star
    const stars = Array.from({ length: 10 }, (_, index) => {
        const fillPercentage = Math.min(1, Math.max(0, averageRating - index));
        return fillPercentage * 100;
    });

    return (
        <div className="rating-stars">
            {stars.map((fill, index) => (
                <div key={index} className="star-wrapper">
                    <svg viewBox="0 0 24 24" className="star">
                        <defs>
                            <linearGradient id={`half-fill-${index}`}>
                                <stop offset={`${fill}%`} stopColor="#FFD700" />
                                <stop offset={`${fill}%`} stopColor="#e4e5e9" />
                            </linearGradient>
                        </defs>
                        <polygon
                            fill={`url(#half-fill-${index})`}
                            points="12,2 15,9 22,9 16,13 18,20 12,16 6,20 8,13 2,9 9,9"
                        />
                    </svg>
                </div>
            ))}
            <div className="rating-side">{averageRating.toFixed(2)}</div>
        </div>
    );
};

export default RatingStars;

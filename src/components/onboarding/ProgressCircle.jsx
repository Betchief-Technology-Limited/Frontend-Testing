export default function ProgressCircle({ value = 0 }) {
    return (
        <div className="relative w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                    d="M18 2.0845 
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={3}
                />

                {/* Progress circle */}
                <path
                  d="M18 2.0845
                      a 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="#6d28d9"
                  strokeWidth={3}
                  strokeDasharray={`${value}, 100`} 
                  strokeLinecap="round"
                />
            </svg>

            {/* Percentage text */}
            <span className="absolute inset-0 flex items-center justify-center tezt-xs font-semibold">
                {value}%
            </span>
        </div>
    )
}
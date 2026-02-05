import React from 'react';

export function StepIndicator({ currentStep, totalSteps, label }) {
    return (
        <div className="w-full max-w-[640px] mb-6 flex flex-col gap-2">
            <div className="flex justify-between items-baseline px-1">
                <p className="text-text-main dark:text-white font-bold text-sm uppercase tracking-wider">
                    Step {currentStep} of {totalSteps}
                </p>
                <p className="text-text-muted font-medium text-sm">{label}</p>
            </div>
            <div className="h-2 w-full bg-border-light dark:bg-border-dark rounded-full overflow-hidden flex gap-2">
                {[...Array(totalSteps)].map((_, index) => {
                    const stepNum = index + 1;
                    let statusClass = 'bg-border-light dark:bg-border-dark';
                    if (stepNum < currentStep) statusClass = 'bg-primary';
                    if (stepNum === currentStep) statusClass = 'bg-primary relative overflow-hidden';

                    return (
                        <div key={index} className={`h-full flex-1 rounded-full transition-all duration-500 ease-out ${statusClass}`}>
                            {stepNum === currentStep && (
                                <div className="absolute inset-0 bg-white/20 w-1/2 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}

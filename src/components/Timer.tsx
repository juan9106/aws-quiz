import React from 'react'

type TimerProps = {
    timeLeft: number
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
        
        return `${minutes}:${remainingSeconds}`;
    };    

    return (
        <div className='timer-container'>
            Time: {formatTime(timeLeft)}
        </div>
    )
}

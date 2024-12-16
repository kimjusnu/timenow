"use client";

import { useState, useEffect } from "react";

interface TimerState {
    isRunning: boolean;
    elapsedTime: number;
    startTime: number | null;
}

const StopwatchTimer = () => {
    const [timerState, setTimerState] = useState<TimerState>({
        isRunning: false,
        elapsedTime: 0,
        startTime: null,
    });

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (timerState.isRunning) {
            intervalId = setInterval(() => {
                setTimerState(prev => ({
                    ...prev,
                    elapsedTime: Date.now() - (prev.startTime || 0),
                }));
            }, 10);
        }

        return () => clearInterval(intervalId);
    }, [timerState.isRunning]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
    };

    const handleStartStop = () => {
        setTimerState(prev => ({
            ...prev,
            isRunning: !prev.isRunning,
            startTime: !prev.isRunning
                ? Date.now() - prev.elapsedTime
                : prev.startTime,
        }));
    };

    const handleReset = () => {
        setTimerState({
            isRunning: false,
            elapsedTime: 0,
            startTime: null,
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 text-white/70">
            <div className="text-3xl font-light mb-4">
                {formatTime(timerState.elapsedTime)}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleStartStop}
                    className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                    {timerState.isRunning ? "정지" : "시작"}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                    리셋
                </button>
            </div>
        </div>
    );
};

export default StopwatchTimer;

"use client";

import { useState, useEffect, useCallback } from "react";

interface Alarm {
    id: string;
    time: string;
    isActive: boolean;
}

const AlarmClock = () => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [newAlarmTime, setNewAlarmTime] = useState("");

    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission();
        }

        const intervalId = setInterval(() => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            });

            alarms.forEach(alarm => {
                if (alarm.isActive && alarm.time === currentTime) {
                    new Notification("알람", {
                        body: `설정한 시간입니다! (${alarm.time})`,
                        icon: "/clock-icon.png",
                    });
                }
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [alarms]);

    const addAlarm = useCallback(() => {
        if (newAlarmTime) {
            setAlarms(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    time: newAlarmTime,
                    isActive: true,
                },
            ]);
            setNewAlarmTime("");
        }
    }, [newAlarmTime]);

    const toggleAlarm = useCallback((id: string) => {
        setAlarms(prev =>
            prev.map(alarm =>
                alarm.id === id
                    ? { ...alarm, isActive: !alarm.isActive }
                    : alarm
            )
        );
    }, []);

    const deleteAlarm = useCallback((id: string) => {
        setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    }, []);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 text-white/70">
            <div className="flex gap-2 mb-4">
                <input
                    type="time"
                    value={newAlarmTime}
                    onChange={e => setNewAlarmTime(e.target.value)}
                    className="bg-white/10 rounded px-3 py-2"
                />
                <button
                    onClick={addAlarm}
                    className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                    알람 추가
                </button>
            </div>
            <div className="space-y-2">
                {alarms.map(alarm => (
                    <div
                        key={alarm.id}
                        className="flex items-center gap-2 p-2 bg-white/10 rounded"
                    >
                        <span
                            className={
                                alarm.isActive ? "text-white" : "text-white/50"
                            }
                        >
                            {alarm.time}
                        </span>
                        <button
                            onClick={() => toggleAlarm(alarm.id)}
                            className="ml-auto px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                        >
                            {alarm.isActive ? "끄기" : "켜기"}
                        </button>
                        <button
                            onClick={() => deleteAlarm(alarm.id)}
                            className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/40"
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlarmClock;

"use client";

import { useEffect, useState } from "react";

const Clock = () => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [is24, setIs24] = useState<boolean>(true);
    const [stars, setStars] = useState<
        {
            id: number;
            top: string;
            left: string;
            size: number;
            opacity: number;
            delay: number;
        }[]
    >([]);

    // 별 생성 - 더 많은 별과 다양한 크기/투명도 추가
    useEffect(() => {
        const generateStars = () => {
            const newStars = Array.from({ length: 800 }, (_, i) => ({
                id: i,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: Math.random() * 2.5, // 더 작은 별들
                opacity: Math.random() * 0.7 + 0.1, // 더 은은한 빛
                delay: Math.random() * 3, // 다양한 반짝임 타이밍
            }));
            setStars(newStars);
        };

        generateStars();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        if (is24) {
            const hours = currentTime.getHours().toString().padStart(2, "0");
            const minutes = currentTime
                .getMinutes()
                .toString()
                .padStart(2, "0");
            const seconds = currentTime
                .getSeconds()
                .toString()
                .padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
        } else {
            let hours = currentTime.getHours();
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            if (hours === 0) hours = 12;

            const displayHours = hours.toString().padStart(2, "0");
            const minutes = currentTime
                .getMinutes()
                .toString()
                .padStart(2, "0");
            const seconds = currentTime
                .getSeconds()
                .toString()
                .padStart(2, "0");
            return `${displayHours}:${minutes}:${seconds} ${ampm}`;
        }
    };

    const formatDate = () => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        };
        return currentTime.toLocaleDateString("ko-KR", options);
    };

    return (
        <div
            className="relative flex items-center justify-center min-h-screen 
            bg-gradient-to-b from-[#050714] via-[#0A0F2D] to-[#050714]
            overflow-hidden"
        >
            {/* 은하수 효과를 위한 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0A0F2D]/30 to-transparent" />

            {/* 별들 */}
            <div className="stars absolute inset-0">
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="star absolute rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animation: `twinkle ${
                                2 + star.delay
                            }s infinite ease-in-out`,
                            backgroundColor: `rgba(255, 255, 255, ${star.opacity})`,
                        }}
                    />
                ))}
            </div>

            {/* 추가 배경 효과 */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative flex flex-col items-center z-10">
                <h1
                    className="text-[10rem] font-extralight tracking-tight 
                    text-white/80 leading-none
                    drop-shadow-xl"
                >
                    {formatTime()}
                </h1>

                {/* 날짜 표시 추가 */}
                <p className="text-2xl font-light text-white/60 mt-4">
                    {formatDate()}
                </p>

                <button
                    onClick={() => setIs24(!is24)}
                    className="mt-10 px-7 py-3 rounded-xl
                    bg-white/5 backdrop-blur-md
                    border border-white/10
                    text-white/70 hover:text-white/90
                    text-sm font-light
                    transition-all duration-300
                    hover:bg-white/10"
                >
                    {is24 ? "12H" : "24H"}
                </button>
            </div>
        </div>
    );
};

export default Clock;

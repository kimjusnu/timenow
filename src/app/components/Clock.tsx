"use client";

import { useEffect, useState, useCallback } from "react";
import Weather from "./Weather";
import MoonPhase from "./MoonPhase";

interface Ripple {
    x: number;
    y: number;
    id: number;
}

const Clock = () => {
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [is24, setIs24] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("timeFormat");
            return saved ? saved === "24" : true;
        }
        return true;
    });
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const generateStars = () => {
            const newStars = Array.from({ length: 400 }, (_, i) => ({
                id: i,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: Math.random() * 2,
                opacity: Math.random() * 0.5 + 0.1,
                delay: Math.random() * 2,
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

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleClick = useCallback((e: React.MouseEvent) => {
        const newRipple = {
            x: e.clientX,
            y: e.clientY,
            id: Date.now(),
        };

        setRipples(prev => {
            const filtered = prev.slice(-2);
            return [...filtered, newRipple];
        });

        setTimeout(() => {
            setRipples(prev =>
                prev.filter(ripple => ripple.id !== newRipple.id)
            );
        }, 800);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const factor = 10;
        setMousePosition({
            x: (e.clientX / window.innerWidth - 0.5) * factor,
            y: (e.clientY / window.innerHeight - 0.5) * factor,
        });
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

    const toggleTimeFormat = () => {
        setIs24(prev => {
            const newValue = !prev;
            localStorage.setItem("timeFormat", newValue ? "24" : "12");
            return newValue;
        });
    };

    if (!mounted) {
        return null;
    }

    return (
        <div
            className="relative flex items-center justify-center min-h-screen 
           bg-gradient-to-b from-[#050714] via-[#0A0F2D] to-[#050714]
           overflow-hidden"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onDoubleClick={toggleFullscreen}
        >
            <Weather />
            <MoonPhase />

            <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0A0F2D]/30 to-transparent" />

            {ripples.map(ripple => (
                <div
                    key={ripple.id}
                    className="absolute w-0 h-0 bg-white/10 rounded-full animate-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        transform: "translate(-50%, -50%)",
                    }}
                />
            ))}

            <div className="stars absolute inset-0">
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="star absolute rounded-full will-change-transform"
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
                            transform: `translate(${
                                mousePosition.x * (star.id % 2)
                            }px, ${mousePosition.y * (star.id % 2)}px)`,
                            transition: "transform 0.1s linear",
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 bg-black/40" />

            <div className="relative flex flex-col items-center z-10">
                <h1
                    className="text-[10rem] font-extralight tracking-tight 
                   text-white/80 leading-none
                   drop-shadow-xl"
                >
                    {formatTime()}
                </h1>

                <p className="text-2xl font-light text-white/60 mt-4">
                    {formatDate()}
                </p>

                <p className="text-sm font-light text-white/40 mt-2">
                    ☝🏻 더블클릭시 전체화면으로 전환됩니다
                </p>

                <button
                    onClick={toggleTimeFormat}
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

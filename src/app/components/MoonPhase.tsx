"use client";

import { useEffect, useState } from "react";

interface MoonPhase {
    phase: number;
    emoji: string;
}

const MoonPhase = () => {
    const [moonPhase, setMoonPhase] = useState<MoonPhase>({
        phase: 0,
        emoji: "🌑",
    });

    useEffect(() => {
        const calculateMoonPhase = () => {
            const date = new Date();
            const synmonth = 29.53058867;
            const date1 = new Date(2000, 0, 6, 18, 14, 0);
            const phase =
                (((date.getTime() - date1.getTime()) / 1000) % synmonth) /
                synmonth;

            const phases = [
                { max: 0.0625, emoji: "🌑" },
                { max: 0.1875, emoji: "🌒" },
                { max: 0.3125, emoji: "🌓" },
                { max: 0.4375, emoji: "🌔" },
                { max: 0.5625, emoji: "🌕" },
                { max: 0.6875, emoji: "🌖" },
                { max: 0.8125, emoji: "🌗" },
                { max: 0.9375, emoji: "🌘" },
                { max: 1.0, emoji: "🌑" },
            ];

            const currentPhase = phases.find(p => phase <= p.max) || phases[0];
            setMoonPhase({ phase, emoji: currentPhase.emoji });
        };

        calculateMoonPhase();
    }, []);

    return (
        <div
            className="absolute top-6 right-6 
            bg-white/5 backdrop-blur-md rounded-xl px-4 py-2
            text-white/70"
        >
            <div className="text-2xl">{moonPhase.emoji}</div>
        </div>
    );
};

export default MoonPhase;

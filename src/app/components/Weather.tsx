"use client";

import { useEffect, useState } from "react";

interface Weather {
    temp: number;
    description: string;
    icon: string;
}

const Weather = () => {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [location, setLocation] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchWeather = async (latitude: number, longitude: number) => {
            try {
                const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) {
                    throw new Error("날씨 정보를 가져오는데 실패했습니다");
                }

                const data = await response.json();

                if (data && data.main && data.weather) {
                    setWeather({
                        temp: Math.round(data.main.temp),
                        description: data.weather[0].description,
                        icon: data.weather[0].icon,
                    });
                    setLocation(data.name || "알 수 없는 위치");
                }
            } catch (error) {
                console.error("날씨 정보를 가져오는데 실패했습니다:", error);
                setError("날씨 정보를 가져오는데 실패했습니다");
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                },
                error => {
                    console.error(
                        "위치 정보를 가져오는데 실패했습니다:",
                        error
                    );
                    setError("위치 정보를 가져오는데 실패했습니다");
                }
            );
        } else {
            setError("위치 정보가 지원되지 않습니다");
        }
    }, []);

    if (error) return null;
    if (!weather) return null;

    return (
        <div
            className="absolute top-6 left-6 flex items-center space-x-4 
            bg-white/5 backdrop-blur-md rounded-xl px-4 py-2
            text-white/70"
        >
            <div className="relative w-8 h-8">
                <div className="text-xl">{getWeatherEmoji(weather.icon)}</div>
            </div>
            <div>
                <div className="text-lg">{weather.temp}°C</div>
                <div className="text-sm">{location}</div>
            </div>
        </div>
    );
};

// Helper function to convert weather icon codes to emojis
const getWeatherEmoji = (iconCode: string): string => {
    const iconMap: { [key: string]: string } = {
        "01d": "☀️", // clear sky day
        "01n": "🌙", // clear sky night
        "02d": "⛅", // few clouds day
        "02n": "☁️", // few clouds night
        "03d": "☁️", // scattered clouds
        "03n": "☁️",
        "04d": "☁️", // broken clouds
        "04n": "☁️",
        "09d": "🌧️", // shower rain
        "09n": "🌧️",
        "10d": "🌦️", // rain
        "10n": "🌧️",
        "11d": "⛈️", // thunderstorm
        "11n": "⛈️",
        "13d": "❄️", // snow
        "13n": "❄️",
        "50d": "🌫️", // mist
        "50n": "🌫️",
    };

    return iconMap[iconCode] || "🌡️"; // default thermometer emoji if code not found
};

export default Weather;

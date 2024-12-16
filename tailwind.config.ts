import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                ripple: {
                    "0%": { width: "0px", height: "0px", opacity: "0.5" },
                    "100%": { width: "500px", height: "500px", opacity: "0" },
                },
            },
            animation: {
                ripple: "ripple 1s ease-out",
            },
        },
    },
    plugins: [],
};

export default config;

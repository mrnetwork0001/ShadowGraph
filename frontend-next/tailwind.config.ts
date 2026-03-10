import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                panel: "rgba(14, 14, 14, 0.85)",
                neonCyan: "#00f3ff",
                neonRed: "#ff003c",
                textPrimary: "#e0e0e0",
            },
            boxShadow: {
                'neon': '0 0 10px #00f3ff, 0 0 20px rgba(0,243,255,0.4)',
                'neon-red': '0 0 10px #ff003c, 0 0 20px rgba(255,0,60,0.4)',
            }
        },
    },
    plugins: [],
};
export default config;

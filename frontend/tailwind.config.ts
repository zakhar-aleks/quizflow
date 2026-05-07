import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: [
        "bg-blue-50",
        "text-blue-600",
        "bg-purple-50",
        "text-purple-600",
        "bg-emerald-50",
        "text-emerald-600",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;

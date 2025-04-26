import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#01693E',
                    foreground: 'hsl(var(--primary-foreground))'
                },
            }
        }
    }
} satisfies Config;
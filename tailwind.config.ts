import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          "2": "var(--color-surface-2)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        text: {
          default: "var(--color-text-default)",
          subtle: "var(--color-text-subtle)",
          muted: "var(--color-text-muted)",
          "on-brand": "var(--color-text-on-brand)",
          "on-dark": "var(--color-text-on-dark)",
        },
        action: {
          DEFAULT: "var(--color-action)",
          hover: "var(--color-action-hover)",
          active: "var(--color-action-active)",
          subtle: "var(--color-action-subtle)",
        },
        admin: {
          DEFAULT: "var(--color-admin)",
          hover: "var(--color-admin-hover)",
          subtle: "var(--color-admin-subtle)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          subtle: "var(--color-success-subtle)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          subtle: "var(--color-warning-subtle)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          hover: "var(--color-danger-hover)",
          subtle: "var(--color-danger-subtle)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          subtle: "var(--color-info-subtle)",
        },
        "focus-ring": "var(--color-focus-ring)",
      },
      fontFamily: {
        sans: ['IRANSansX', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

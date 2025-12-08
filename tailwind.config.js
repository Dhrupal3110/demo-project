export default {
    darkMode: 'class', // enable class-based toggling
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                primaryLight: 'var(--color-primary-light)',
                primaryDark: 'var(--color-primary-dark)',
                background: 'var(--color-bg)',
                text: 'var(--color-text)',
            },
        },
    },
    plugins: [],
}

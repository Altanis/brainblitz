module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "main": "#6c63ff",
                "button": "#cbd5e1",
                "button-hover": "#e2e8f0",
                "green-accent": "#62FF6C",
                "purple-accent": "#ba63ff",
            },
            boxShadow: {
                "green-glow": "0 0 15px 0 #62FF6C",
                "purple-glow": "0 0 15px 0 #ba63ff"
            }
        },
    },
    plugins: [],
}
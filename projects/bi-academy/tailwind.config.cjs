/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './content/**/*.mdx',
    ],
    theme: {
        extend: {
            colors: {
                cream: {
                    50: '#FDFBF9',
                    100: '#F8F5F1',
                    200: '#F0EBE4',
                    300: '#E4DDD4',
                    400: '#C9BFAE',
                },
                navy: {
                    950: '#0B0F1E',
                    900: '#121830',
                    800: '#1C2340',
                    700: '#2A3358',
                    600: '#404C72',
                },
                terra: {
                    600: '#A14B2A',
                    500: '#C45D36',
                    400: '#D47E5C',
                    300: '#E4A88C',
                    100: '#FDF1EB',
                },
                sage: {
                    600: '#3B7050',
                    500: '#4E8B63',
                    400: '#6FA882',
                    100: '#EFF7F1',
                },
                ink: {
                    900: '#1E1B18',
                    700: '#3D3733',
                    500: '#6E645A',
                    400: '#908478',
                    300: '#B3A99E',
                },
            },
        },
    },
    plugins: [],
};

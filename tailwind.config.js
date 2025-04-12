// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       keyframes: {
//         'google-line': {
//           '0%': { width: '0%' },
//           '100%': { width: '100%' },
//         },
//       },
//       animation: {
//         'google-line': 'google-line 1.5s linear forwards', // Adjust duration
//       },
//     },
//   },
//   plugins: [],
// // }

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

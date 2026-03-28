module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          bg:            '#F6F5F1',
          surface:       '#FFFFFF',
          surface2:      '#EFEDE9',
          border:        '#E3E0DA',
          border2:       '#CCCAC4',
          text:          '#1C1B18',
          text2:         '#74726D',
          text3:         '#AEACA7',
          accent:        '#7C2D3E',
          'accent-bg':   '#F5EAEC',
          'accent-border':'#D9A0AA',
        }
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'Sora', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: []
}

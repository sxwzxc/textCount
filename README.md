# Text Count Tool

This project provides a lightweight text counter that runs entirely in the browser. It helps you quickly understand the length and structure of any text, including detailed breakdowns for English, Chinese (Han), symbols, digits, and whitespace.

## Features

- Real-time counts: total, English, Chinese, symbols
- Detailed breakdown: digits, whitespace, other symbols, unique characters
- Structure stats: English words, lines, paragraphs
- UTF-8 byte size estimate
- Local-only processing with auto-save and one-click copy

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Counting Rules

- English: A–Z / a–z only
- Chinese: Unicode Han characters only
- Symbols: everything else (digits, whitespace, punctuation, emoji, etc.)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

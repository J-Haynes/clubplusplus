# Club++

> Earn points. Lose privacy. Repeat.

A satirical loyalty card barcode generator. Shows how supermarket loyalty schemes work — and why they're not actually in your interest.

## Running

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What it does

Generates a valid barcode number for the loyalty scheme format: 12-digit fixed prefix + 3 random digits + Luhn check digit, rendered as a full-width CODE128 barcode you can scan at a till.

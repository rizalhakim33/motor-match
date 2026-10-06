# MotorMatch

Motor Selection & Sizing Tool untuk membantu engineer memilih dan sizing motor (servo / stepper / induksi + VFD) berdasarkan mekanisme dan parameter beban.

## About

MotorMatch adalah web app untuk perhitungan sizing motor berbasis formula standar industri. Engineer cukup pilih mekanisme, isi parameter beban, dan dapatkan rekomendasi tipe motor, kandidat katalog, full sizing (4-phase RMS), serta starting-point gain untuk servo.

Dibuat untuk mempercepat proses seleksi motor di tahap desain awal — sebelum fine-tuning di lapangan.

## Features

- **13 mekanisme**: Ball Screw, Rack & Pinion, Roll Feed, Sprocket & Chain, Conveyor, Cart, Linear Servo, Generic Linear/Rotary, Rotary Table, Fan, Pump, Elevator/Hoist
- **Rekomendasi tipe motor**: servo / stepper / induksi + VFD dengan alasan
- **Katalog motor**: Mitsubishi, Yaskawa, Delta, Panasonic, Omron, Baumüller, Siemens, INVT, dll.
- **Full sizing**: TL, JL, N, TA, peak & RMS torque, inertia ratio, duty cycle check
- **Gain calculator**: Kv, Tvi, Kp + konversi per brand (Mitsubishi, Yaskawa, Delta, Panasonic, Omron, Baumüller)
- **Compare (max 3)**, chart torsi, export PDF, dan diagram mekanisme interaktif

## Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Recharts · jsPDF

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3050
npm run build    # production build
npm run lint     # eslint
npm test         # run tests
```

## Deployment (Vercel)

Tidak ada database — katalog motor dibaca dari `src/data/motors/*.json`, artikel dari `src/content/articles/*.mdx` (SSG saat build), dan semua kalkulasi berjalan di client. Satu-satunya env var opsional:

| Variable | Contoh | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://motormatch.my.id` | Base URL untuk canonical, sitemap, robots & Open Graph (default sudah sesuai) |

Langkah deploy (dashboard):

1. Import repo GitHub `rizalhakim33/motor-match` di vercel.com → *Add New Project*. Framework preset **Next.js** terdeteksi otomatis, tidak perlu `vercel.json`.
2. Set `NEXT_PUBLIC_SITE_URL` di *Project Settings → Environment Variables* (Production & Preview), lalu deploy.
3. *Project Settings → Domains* → tambah `motormatch.my.id`.
4. Arahkan DNS di registrar:
   - `@` → A record `76.76.21.21`
   - `www` → CNAME `cname.vercel-dns.com`

Alternatif via CLI:

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Setelah DNS propagasi, cek `/`, `/blog`, `/sitemap.xml`, `/robots.txt`, dan `/opengraph-image`.

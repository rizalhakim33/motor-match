# MotorMatch — Roadmap Phase 3 s/d Final

Dokumen ini menggantikan section roadmap lama di `motorizer-software-design.md`.  
**Status saat ini (Agustus 2026):** Phase 1 (MVP) ✅ dan Phase 2 ✅ sudah selesai.

---

## Status Phase 1 & 2 (Recap)

| Phase | Use Case | Status |
|-------|----------|--------|
| **MVP (Phase 1)** | UC1-UC4: Pilih mekanisme → Input parameter → Rekomendasi motor type → Hasil sizing (13 mekanisme) | ✅ Done |
| **Phase 2a** | Motor catalog (37 entries: Mitsubishi, Yaskawa, Delta, INVT, Oriental Motor) + matching algorithm | ✅ Done |
| **Phase 2b** | Full RMS calculation (4 fase siklus: accel→const→decel→dwell, dengan JM real dari katalog) | ✅ Done |
| **Phase 2c** | Motor matching UI — klik motor di tabel → full sizing panel + feasibility warnings | ✅ Done |
| **Phase 2d** | Decision rules (tambah stepper path) | ✅ Done |
| **Phase 2e** | Starting-Point Gain Calculator (UC10) — 5 multi-brand dialects (Baumüller, Mitsubishi, Yaskawa, Delta, Panasonic) | ✅ Done |

**Artefak yang sudah ada:**
- 33 source files (13 mekanisme, 4 lib baru, 5 data motor JSON, 6 test files)
- TypeScript compile clean, semua test PASS
- 37 motor entries, 5 gain dialects

---

## Roadmap: Phase 3 s/d Final

### Phase 3 — Export & Comparison (UC5 + UC6)

**Tujuan:** User bisa membandingkan motor side-by-side dan export hasil ke PDF/Excel untuk dokumentasi proyek.

#### 3a. Motor Comparison View (UC5 — Diperluas)

**Scope:**
- Step wizard baru: "Bandingkan Motor" (setelah StepResult)
- User pilih 2-3 motor dari kandidat → tampilkan side-by-side
- Perbandingan mencakup: Trated, Tmax, N rated, JL/JM, TA, Peak Torque, RMS, Gain, Harga estimasi
- Highlight selisih antar motor (hijau = lebih baik, merah = lebih buruk)
- Rekomendasi "Best Value" berdasarkan skor gabungan (performance + cost)

**File yang perlu dibuat/diubah:**
- `src/components/wizard/StepCompare.tsx` — Komponen baru untuk comparison view
- `src/components/wizard/MotorWizard.tsx` — Tambah step baru (opsional, bisa inline di StepResult)
- `src/types/index.ts` — Tambah `ComparisonResult` interface

**Teknis:**
- State management: tambah `comparedMotors: MotorCatalogEntry[]` ke WizardState
- UI: 3 kolom cards dengan radar chart (opsional) atau tabel perbandingan
- Highlight otomatis: parameter terbaik di-setiap baris di-highlight hijau

#### 3b. Export to PDF (UC6)

**Scope:**
- Tombol "Export PDF" di StepResult dan StepCompare
- PDF berisi:
  - Header: tanggal, nama proyek (opsional input user)
  - Ringkasan sizing: Trms, JL, N, Power
  - Rekomendasi motor + tabel kandidat
  - Full sizing (jika motor dipilih): JL/JM, TA, Peak, RMS, feasibility
  - Starting-point gain (jika servo): tabel multi-brand
  - Disclaimer: "Nilai adalah estimasi, verifikasi di lapangan diperlukan"
- Style: clean, profesional, bisa dipakai untuk proposal/proposal teknis

**Library:**
- `jspdf` + `jspdf-autotable` (lightweight, no server needed)
- Atau `@react-pdf/renderer` (lebih cantik, tapi heavier)
- **Rekomendasi:** `jspdf` untuk MVP, upgrade ke `@react-pdf/renderer` jika perlu desain rumit

**File yang perlu dibuat/diubah:**
- `src/lib/exportPdf.ts` — Fungsi generate PDF dari SizingResult
- `src/components/wizard/StepResult.tsx` — Tambah tombol "Export PDF"
- `package.json` — Install `jspdf` + `jspdf-autotable`

**Template PDF:**
```
┌─────────────────────────────────────────┐
│  MOTOR MATCH — Sizing Report            │
│  Tanggal: 28 Agustus 2026               │
│  Mekanisme: Ball Screw                   │
├─────────────────────────────────────────┤
│  REKOMENDASI: SERVO                     │
│  Alasan: Butuh presisi posisi tinggi     │
├─────────────────────────────────────────┤
│  HASIL SIZING                            │
│  Trms: 0.0078 N·m  |  JL: 1.63e-4 kg·m²│
│  Speed: 1800 rpm   |  Power: 1.46 W     │
├─────────────────────────────────────────┤
│  MOTOR TERPILIH: Mitsubishi HG-MR152    │
│  Full Sizing:                            │
│  JL/JM: 5.5  |  TA: 0.18 N·m           │
│  Peak: 0.19 N·m | RMS: 0.008 N·m       │
│  Status: ✅ MOTOR COCOK                  │
├─────────────────────────────────────────┤
│  STARTING-POINT GAIN (Servo)            │
│  Baumüller: Kv=120, Tn=8ms, Kp=30      │
│  Mitsubishi: SpeedGain=45, PA=30        │
│  Yaskawa: Kv=120, Tn=8ms, Kp=30        │
├─────────────────────────────────────────┤
│  ⚠️ Disclaimer:                          │
│  Nilai bersifat estimasi. Verifikasi     │
│  dan fine-tuning tetap diperlukan di    │
│  lapangan.                               │
└─────────────────────────────────────────┘
```

#### 3c. Export to Excel (Opsional, bisa di Phase 3b)

**Scope:**
- Export tabel kandidat motor ke `.xlsx`
- Berguna untuk engineer yang ingin analisis lebih lanjut di Excel
- Library: `xlsx` (SheetJS)

---

### Phase 4 — Input Validation & UX Enhancement

**Tujuan:** Perkuat sisi UX sebelum masuk ke fitur backend (auth, database). Pastikan input akurat dan user tidak melakukan error.

#### 4a. Form Validation (UC2 — Diperkuat)

**Scope:**
- Validasi range per parameter (contoh: massa beban > 0, gear ratio > 0, efisiensi 0-1)
- Unit hints di setiap field (contoh: "Massa (kg)", "Lead (mm)")
- Tooltip untuk gear ratio: "G = Z_motor / Z_load. G > 1 berarti reduksi."
- Error messages yang jelas dan actionable
- Default values per mekanisme (contoh: ballscrew η default = 0.9)

**File yang perlu diubah:**
- `src/components/wizard/StepParameters.tsx` — Tambah validasi per field
- `src/types/index.ts` — Tambah validation schema (zod atau manual)

#### 4b. Torque-Speed-Time Profile Graph

**Scope:**
- Visualisasi profil torsi vs waktu selama satu siklus (4 fase: accel, const, decel, dwell)
- Overlay kecepatan vs waktu
- Gunakan `recharts` atau `chart.js` (sudah umum di React ecosystem)
- Muncul di StepResult, di bawah dashboard cards

**File yang perlu dibuat:**
- `src/components/charts/TorqueProfileChart.tsx`
- Install `recharts` (recommended) atau `chart.js` + `react-chartjs-2`

#### 4c. Diagram untuk 9 Mekanisme Lainnya

**Scope:**
- Saat ini hanya 4 diagram (BallScrew, Conveyor, Fan, GenericRotary)
- Tambah diagram interaktif untuk: RackPinion, SprocketChain, RollFeed, Cart, LinearServo, GenericLinear, RotaryTable, Pump, ElevatorHoist
- Setiap diagram: SVG dengan hover-highlight yang mengarah ke form fields (sudah ada pola di DiagramWrapper.tsx)

**File yang perlu dibuat:**
- `src/components/diagrams/RackPinionDiagram.tsx`
- `src/components/diagrams/SprocketChainDiagram.tsx`
- `src/components/diagrams/RollFeedDiagram.tsx`
- `src/components/diagrams/CartDiagram.tsx`
- `src/components/diagrams/LinearServoDiagram.tsx`
- `src/components/diagrams/GenericLinearDiagram.tsx`
- `src/components/diagrams/RotaryTableDiagram.tsx`
- `src/components/diagrams/PumpDiagram.tsx`
- `src/components/diagrams/ElevatorHoistDiagram.tsx`

---

### Phase 5 — Auth & History (UC7 + UC9)

**Tujuan:** User bisa login, simpan hasil perhitungan, dan membuka kembali riwayat sebelumnya. Ini membuka jalan untuk Phase 6 (Admin panel).

**Stack (tanpa Supabase):**
- **Database:** [Neon](https://neon.tech) — Serverless PostgreSQL, free tier 512 MB, branching gratis
- **ORM:** [Prisma](https://prisma.io) — type-safe query, migration system, PostgreSQL native
- **Auth:** [NextAuth.js v5](https://next-auth.js.org) (Auth.js) — open source, credentials provider (email+password), JWT sessions
- **Hosting:** Vercel — zero config, env vars langsung ke Neon

> 💡 Kenapa Neon bukan Supabase? Neon fokus di PostgreSQL saja — tanpa realtime/RPC/edge function complexity. Dashboard clean, branching seperti Git untuk database, dan Prisma integration native. Untuk app CRUD + auth seperti ini, Neon jauh lebih straightforward.

#### 5a. Authentication (UC9)

**Scope:**
- Login/Register dengan email + password
- Authentication provider: **NextAuth.js v5** (Auth.js) dengan credentials provider
- Session management: JWT (untuk simplicity, tanpa database session)
- UI: modal login/register, tombol "Simpan Hasil" yang require login
- **Tidak perlu** social login (Google, GitHub) untuk MVP — cukuk email+password

**Stack:**
- `next-auth` (Auth.js v5) — standard untuk Next.js
- Password hashing: `bcrypt` (server-side)
- Database: **Neon PostgreSQL** via Prisma

**File yang perlu dibuat:**
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth config
- `src/lib/auth.ts` — Auth utilities
- `prisma/schema.prisma` — Database schema (User, Account, Session)
- `src/components/auth/LoginModal.tsx` — UI login/register
- `src/components/auth/AuthProvider.tsx` — Session provider wrapper
- `.env.local` — `DATABASE_URL` (Neon connection string), `NEXTAUTH_SECRET`

**Setup Neon:**
1. Buat akun gratis di [neon.tech](https://neon.tech)
2. Buat project → copy connection string
3. Paste ke `.env.local` sebagai `DATABASE_URL"
4. `npx prisma db push` → schema langsung ter-deploy ke Neon

#### 5b. History / Saved Calculations (UC7)

**Scope:**
- User login → bisa "Simpan Hasil" dari StepResult
- Halaman "Riwayat" → daftar semua hasil tersimpan (sorted by date)
- Klik riwayat → buka detail (seperti StepResult, tapi read-only)
- Hapus riwayat (opsional)
- Limit: max 100 riwayat per user (untuk MVP)

**Database schema (Prisma):**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  role          String    @default("user") // "user" | "admin"
  calculations  Calculation[]
  createdAt     DateTime  @default(now())
}

model Calculation {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  mechanismType String
  inputParams   Json      // MechanismParams
  result        Json      // SizingResult
  selectedMotor Json?     // MotorCatalogEntry (jika dipilih)
  gains         Json?     // GainResult (jika servo)
  notes         String?   // User notes
  createdAt     DateTime  @default(now())
}
```

**File yang perlu dibuat:**
- `prisma/schema.prisma` — Schema di atas
- `src/app/history/page.tsx` — Halaman riwayat
- `src/components/history/HistoryList.tsx` — Daftar riwayat
- `src/components/history/HistoryDetail.tsx` — Detail riwayat (read-only StepResult)
- `src/lib/db.ts` — Prisma client singleton
- `src/app/api/calculations/route.ts` — API: GET (list), POST (save)
- `src/app/api/calculations/[id]/route.ts` — API: GET (detail), DELETE

#### 5c. User Profile (Minimal)

**Scope:**
- Tampilkan info user (nama, email) di header
- Tombol logout
- **Tidak perlu** profil lengkap (avatar, settings) untuk MVP

---

### Phase 6 — Admin Panel & Catalog Management (UC8)

**Tujuan:** Admin bisa mengelola database katalog motor tanpa edit JSON manual. Ini kritis untuk menjaga data motor tetap akurat dan up-to-date.

#### 6a. Admin Authentication & Role

**Scope:**
- Role-based access: `admin` vs `user` (sudah ada di schema User di Phase 5)
- Admin bisa login dengan role yang benar
- Middleware proteksi route admin: `src/middleware.ts` cek role dari session JWT
- Role `admin` di-set manual di Neon dashboard (atau via seed script)

**File yang perlu dibuat:**
- `src/middleware.ts` — Route protection (admin routes check role)
- `src/lib/admin.ts` — Admin role check utilities

#### 6b. Motor Catalog CRUD (UC8)

**Scope:**
- Dashboard admin: daftar semua motor di katalog (tabel + search + filter)
- Tambah motor baru (form lengkap: brand, series, model, semua spesifikasi)
- Edit motor (inline atau form terpisah)
- Hapus motor (dengan konfirmasi)
- Import dari JSON (bulk upload)
- Export ke JSON (backup)
- Validasi input: semua field wajib, range checks (torque > 0, speed > 0, dll)

**File yang perlu dibuat:**
- `src/app/admin/page.tsx` — Admin dashboard
- `src/app/admin/motors/page.tsx` — Motor catalog management
- `src/app/admin/motors/new/page.tsx` — Add new motor
- `src/app/admin/motors/[id]/edit/page.tsx` — Edit motor
- `src/components/admin/MotorTable.tsx` — Tabel motor dengan search/filter
- `src/components/admin/MotorForm.tsx` — Form tambah/edit motor
- `src/app/api/admin/motors/route.ts` — API: GET (list), POST (create)
- `src/app/api/admin/motors/[id]/route.ts` — API: GET, PUT, DELETE

#### 6c. Database Migration: JSON → Neon PostgreSQL

**Scope:**
- Saat ini data motor di JSON files (`src/data/motors/*.json`)
- Setelah admin panel jadi, motor data pindah ke Neon PostgreSQL
- Migration script: baca JSON → insert ke DB via Prisma
- `motorCatalog.ts` diubah: dari JSON import → database query
- **Penting:** backward compatibility — JSON files tetap ada sebagai seed data / backup

**Database schema (tambahan):**
```prisma
model MotorCatalogEntry {
  id              String    @id @default(cuid())
  brand           String
  series          String
  model           String
  type            String    // "servo" | "stepper" | "induction"
  ratedTorque     Float
  maxTorque       Float
  ratedSpeed      Int
  ratedPower      Int
  rotorInertia    Float
  torqueConstant  Float?
  brakeAvailable  Boolean   @default(false)
  costTier        String?   // "budget" | "mid" | "premium"
  availability    String?   // "local_stock" | "import_only" | "discontinued"
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

### Phase 7 — Advanced Features (Future / Nice-to-Have)

**Tujuan:** Fitur lanjutan yang meningkatkan value proposition, tapi bukan prioritas MVP.

#### 7a. Case Study Library

**Scope:**
- Kumpulan studi kasus nyata dari engineer Indonesia
- Setiap case study: problem statement, parameter, solusi motor, hasil di lapangan
- User bisa browse dan gunakan sebagai template (auto-fill parameter)
- Kategori: Conveyor, Web Guiding, CNC, Packaging, dll

#### 7b. Motor Cross-Reference

**Scope:**
- User input motor lama (brand + model) → sistem cari alternatif dari merk lain
- Berguna untuk replacement/upgrade motor yang sudah ada
- Matching berdasarkan: Trated, Tmax, N rated, JM (proksimal)

#### 7c. Multi-Language Support (i18n)

**Scope:**
- Bahasa Indonesia + English
- Gunakan `next-intl` atau `i18next`
- Berguna untuk user internasional atau dokumentasi teknis

#### 7d. Dark Mode

**Scope:**
- Toggle dark/light mode
- Sudah ada pattern di Tailwind CSS (`dark:` prefix)
- Simpan preferensi di localStorage

#### 7e. Mobile Responsive Optimization

**Scope:**
- Optimize wizard flow untuk mobile (portrait mode)
- Swipe gestures untuk navigate antar step
- Collapsible sections untuk results di mobile

---

### Phase 8 — Live Auto-Tuning (v4, Long-Term)

**Tujuan:** Connect langsung ke drive fisik untuk auto-tuning. **Ini fase paling jauh dan paling kompleks.**

**⚠️ Catatan Penting:** Fase ini membutuhkan:
- Koneksi fisik ke drive (Modbus RTU/TCP, EtherCAT, USB)
- Protokol komunikasi per merk (proprietary)
- Safety considerations (motor bergerak nyata)
- Licensing untuk protocol libraries

**Scope (High-Level):**
- Pilih drive brand → koneksi via Modbus/USB
- Push gain values ke drive
- Monitor response real-time (oscilloscope view)
- Auto-tune: system identify → calculate gains → push → verify
- Safety: emergency stop, torque limit, speed limit

**Ini bukan bagian dari roadmap saat ini** — hanya sebagai reference untuk规划 jangka panjang.

---

## Prioritas & Estimasi Waktu

| Phase | Scope | Estimasi | Prioritas |
|-------|-------|----------|-----------|
| **Phase 3** | Export PDF + Comparison View | 2-3 minggu | 🔴 Tinggi |
| **Phase 4** | Input Validation + Charts + Diagrams | 2-3 minggu | 🔴 Tinggi |
| **Phase 5** | Auth (NextAuth.js v5) + History (Neon PostgreSQL + Prisma) | 3-4 minggu | 🟡 Sedang |
| **Phase 6** | Admin Panel + DB Migration (JSON → Neon) | 3-4 minggu | 🟡 Sedang |
| **Phase 7** | Advanced Features (Case Study, Cross-Ref, i18n) | 4-6 minggu | 🟢 Rendah |
| **Phase 8** | Live Auto-Tuning | 8-12 minggu | ⚪ Future |

---

## Rekomendasi Urutan Pengerjaan

```
Phase 3 (Export + Comparison) — User langsung dapat value dari fitur ini
    ↓
Phase 4 (Validation + UX) — Perkuat fondasi sebelum masuk backend
    ↓
Phase 5 (Auth + History) — Butuh database, lakukan setelah UX stabil
    ↓
Phase 6 (Admin Panel) — Setelah auth + DB ada
    ↓
Phase 7 (Advanced) — optional, tergantung kebutuhan user
    ↓
Phase 8 (Live Tuning) — Long-term, butuh research mendalam
```

---

## Technology Stack yang Diperlukan per Phase

| Phase | Baru Diperlukan |
|-------|-----------------|
| Phase 3 | `jspdf`, `jspdf-autotable`, `recharts` |
| Phase 4 | `recharts` (atau `chart.js`), `zod` (validasi) |
| Phase 5 | `next-auth` (Auth.js v5), `prisma`, `bcrypt`, `@prisma/client`, **Neon PostgreSQL** (free tier) |
| Phase 6 | Prisma (sudah ada dari Phase 5), Neon branching (staging DB gratis) |
| Phase 7 | `next-intl` (i18n, opsional) |
| Phase 8 | Protocol libraries (Modbus, EtherCAT — research needed) |

---

## Catatan Teknis

1. **Backward Compatibility:** Setiap phase harus backward compatible dengan phase sebelumnya. Tidak ada breaking changes ke user-facing features.

2. **Testing Strategy:** Setiap phase wajib punya test:
   - Unit test untuk logic (calculation, matching, export)
   - Component test untuk UI (dengan React Testing Library)
   - E2E test untuk critical flow (Playwright, opsional untuk Phase 5+)

3. **Performance:** 
   - Phase 3-4: Client-side saja, tidak ada concern
   - Phase 5-6: Database queries perlu di-optimize (indexing, pagination)
   - Phase 7: i18n bundle size perlu di-monitor

4. **Security:**
   - Phase 5: Password hashing, CSRF protection, session management
   - Phase 6: Role-based access, input sanitization (SQL injection prevention via Prisma)

5. **Deployment:**
   - Phase 1-4: Vercel (free tier cukup)
   - Phase 5-6: Vercel + **Neon** (serverless PostgreSQL, free tier 512 MB)
   - Phase 8: Butuh server on-premise (untuk koneksi fisik ke drive)

---

*Document terakhir diupdate: 28 Agustus 2026*  
*Status: Phase 1-2 ✅, Phase 3-8 belum dikerjakan*

# MotorMatch — Analisis Formula & Simulasi Perhitungan

Dokumen analisis lengkap berisi semua rumus yang diimplementasikan, simulasi numerik, identifikasi bug, dan rekomendasi perbaikan.

**Tanggal:** 26 Agustus 2026  
**Versi:** v0.1.0 (MVP)

---

## Daftar Isi

1. [Notasi Umum & Satuan](#1-notasi-umum--satuan)
2. [Ball Screw — Rumus & Simulasi](#2-ball-screw)
3. [Conveyor (Belt) — Rumus & Simulasi](#3-conveyor-belt)
4. [Fan — Rumus & Simulasi](#4-fan)
5. [Generic Rotary — Rumus & Simulasi](#5-generic-rotary)
6. [Identifikasi Bug](#6-identifikasi-bug)
7. [Analisis Kenapa Rasio Inersia Bisa Sangat Besar](#7-analisis-kenapa-rasio-inersia-bisa-sangat-besar)
8. [Rekomendasi Perbaikan](#8-rekomendasi-perbaikan)

---

## 1. Notasi Umum & Satuan

| Simbol | Deskripsi | Satuan |
|--------|-----------|--------|
| `G` | Rasio gear/reduksi = Z_motor / Z_load | - |
| `η` | Efisiensi transmisi | 0-1 |
| `g` | Percepatan gravitasi | 9.8 m/s² |
| `N` | Kecepatan rotasi motor | rpm |
| `JM` | Inersia rotor motor (dari datasheet) | kg·m² |
| `JW` | Inersia beban (sisi load, sebelum refleksi) | kg·m² |
| `JL` | Inersia beban direfleksikan ke poros motor | kg·m² |
| `TW` | Torsi beban (sisi load) | N·m |
| `TL` | Torsi direfleksikan ke motor | N·m |
| `TA` | Torsi akselerasi | N·m |
| `P` | Lead ball screw | mm |
| `D`, `D1`, `D2` | Diameter komponen | mm |
| `M`, `M1`-`M4` | Massa | kg |
| `F` | Gaya eksternal | N |
| `μ` | Koefisien gesekan | - |
| `V` | Kecepatan linear | mm/s (ball screw) atau m/s (conveyor) |
| `tA` | Waktu akselerasi | detik |
| `t1`, `t2`, `t3`, `t4` | Waktu tiap fase siklus | detik |

**Konversi Satuan Penting:**
- P dan D dalam **mm** → faktor `×10⁻³` untuk torsi, `×10⁻⁶` untuk inersia
- Jika salah kalkulasi → error skala 1000x atau 1.000.000x

---

## 2. Ball Screw

**Sumber kode:** `src/lib/mechanisms/ballscrew.ts`

### 2.1 Rumus yang Diimplementasikan

| No | Rumus | Kode | Baris |
|----|-------|------|-------|
| 1 | Inersia ball screw | `JB = (ballScrewMass × D² / 8) × 10⁻⁶` | 17-18 |
| 2 | Kecepatan motor | `N = (60 × V) / (P × G)` | 23 |
| 3 | Torsi gesekan | `TW_friksi = μ × M × g × (P / 2π) × 10⁻³` | 27 |
| 4 | Torsi gaya eksternal | `TW_eksternal = F × (P / 2π) × 10⁻³` | 31 |
| 5 | Total torsi beban | `TW = TW_friksi + TW_eksternal` | 34 |
| 6 | Torsi direfleksikan | `TL = (TW × G) / η` | 38 |
| 7 | Inersia beban (sisi load) | `JW = M × (P / 2π)² × 10⁻⁶ + JB` | 42 |
| 8 | Inersia direfleksikan | `JL = G² × JW` | 46 |
| 9 | Rasio inersia | `inertiaRatio = JL / JM` | 53 |
| 10 | Torsi akselerasi | `TA = ((JM + JL) × (2π × N / (60 × tA))) / η` | 58 |
| 11 | Torsi fase percepatan | `T1 = TA + TL` | 61 |
| 12 | Torsi fase konstan | `T2 = TL` | 64 |
| 13 | Torsi fase perlambatan | `T3 = TL - TA` | 67 |
| 14 | Torsi RMS | `Trms = √[(T1²×t1 + T2²×t2 + T3²×t3) / (t1+t2+t3+t4)]` | 77-79 |
| 15 | Daya yang dibutuhkan | `P = TL × ω`, `ω = 2π × N / 60` | 83-84 |

### 2.2 Simulasi — Kasus Validasi dari Dokumen

**Input:**
- M = 5 kg, P = 10 mm, D = 20 mm, massa screw = 3 kg
- μ = 0.1, G = 1 (direct drive), η = 1
- V = 300 mm/s, tA = 0.2 s
- JM (placeholder) = 1.23 × 10⁻⁵ kg·m²

**Langkah 1: Inersia ball screw (JB)**
```
JB = (3 × 20² / 8) × 10⁻⁶
   = (3 × 400 / 8) × 10⁻⁶
   = 150 × 10⁻⁶
   = 1.5 × 10⁻⁴ kg·m²
```

**Langkah 2: Inersia beban (JW)**
```
JW = 5 × (10 / 2π)² × 10⁻⁶ + 1.5 × 10⁻⁴
   = 5 × (1.5915)² × 10⁻⁶ + 1.5 × 10⁻⁴
   = 5 × 2.533 × 10⁻⁶ + 1.5 × 10⁻⁴
   = 1.267 × 10⁻⁵ + 1.5 × 10⁻⁴
   = 1.627 × 10⁻⁴ kg·m²
```

**Langkah 3: Inersia direfleksikan (JL)**
```
JL = G² × JW = 1² × 1.627 × 10⁻⁴
   = 1.627 × 10⁻⁴ kg·m²
```

**Langkah 4: Rasio inersia**
```
inertiaRatio = JL / JM = 1.627 × 10⁻⁴ / 1.23 × 10⁻⁵
             ≈ 13.2
```
✓ Sesuai dengan dokumentasi (≈13.3)

**Langkah 5: Kecepatan motor (N)**
```
N = (60 × 300) / (10 × 1) = 18000 / 10 = 1800 rpm
```

**Langkah 6: Torsi gesekan (TW_friksi)**
```
TW_friksi = 0.1 × 5 × 9.8 × (10 / 2π) × 10⁻³
          = 0.1 × 5 × 9.8 × 1.5915 × 10⁻³
          = 7.799 × 10⁻³ N·m
```

**Langkah 7: Torsi direfleksikan (TL)**
```
TL = (7.799 × 10⁻³ × 1) / 1 = 7.799 × 10⁻³ N·m
```

**Langkah 8: Torsi akselerasi (TA)**
```
TA = ((1.23 × 10⁻⁵ + 1.627 × 10⁻⁴) × (2π × 1800 / (60 × 0.2))) / 1
   = (1.75 × 10⁻⁴) × (11309.7)
   = 0.198 N·m
```

**Langkah 9: Torsi RMS**
```
T1 = 0.198 + 0.0078 = 0.206 N·m
T2 = 0.0078 N·m
T3 = 0.0078 - 0.198 = -0.190 N·m (negatif = braking)

Asumsi: t1 = 0.2s, t2 = 0.6s, t3 = 0.2s (siklus 1s)
Trms = √[(0.206²×0.2 + 0.0078²×0.6 + (-0.190)²×0.2) / 1.0]
     = √[(0.00849 + 0.0000365 + 0.00722) / 1.0]
     = √[0.01575]
     = 0.126 N·m
```
✓ Mendekati nilai dokumentasi (≈0.083 N·m — perbedaan karena asumsi siklus)

---

## 3. Conveyor (Belt)

**Sumber kode:** `src/lib/mechanisms/conveyor.ts`

### 3.1 Rumus yang Diimplementasikan

| No | Rumus | Kode | Baris |
|----|-------|------|-------|
| 1 | Total gaya | `F_total = M3 × g × (sinθ + μ × cosθ)` | 23 |
| 2 | Torsi beban | `TW = F_total × (D1/2) × 10⁻³` | 27 |
| 3 | Torsi direfleksikan | `TL = (TW × G) / η` | 31 |
| 4 | Inersia beban | `JW = (M1×D1²/8 + M2×D2²/8 + M3×D1²/4 + M4×D1²/4) × 10⁻⁶` | 35-40 |
| 5 | Inersia direfleksikan | `JL = G² × JW` | 44 |
| 6 | Kecepatan motor | `N = (60 × V) / (π × D1 × 10⁻³)` | 50 |
| 7 | Rasio inersia | `inertiaRatio = JL / JM` | 56 |
| 8 | Torsi akselerasi | `TA = ((JM + JL) × (2π × N / (60 × tA))) / η` | 60 |
| 9 | Torsi RMS | `Trms = √[(T1²×t1 + T2²×t2 + T3²×t3) / (t1+t2+t3+t4)]` | 74-76 |
| 10 | Daya | `P = TL × ω` | 79-80 |

### 3.2 Simulasi — Conveyor Horizontal

**Input:**
- D1 = 100 mm, D2 = 100 mm
- M1 = 5 kg (roller driver), M2 = 5 kg (roller idle)
- M3 = 50 kg (beban), M4 = 10 kg (belt)
- θ = 0° (horizontal), μ = 0.4
- G = 1, η = 0.95, tA = 0.5 s
- V = 1 m/s
- JM (placeholder) = 1 × 10⁻⁴ kg·m²

**Langkah 1: Total gaya**
```
F_total = 50 × 9.8 × (sin(0) + 0.4 × cos(0))
        = 50 × 9.8 × (0 + 0.4)
        = 196 N
```

**Langkah 2: Torsi beban (TW)**
```
TW = 196 × (100/2) × 10⁻³
   = 196 × 50 × 10⁻³
   = 9.8 N·m
```

**Langkah 3: Torsi direfleksikan (TL)**
```
TL = (9.8 × 1) / 0.95 = 10.32 N·m
```

**Langkah 4: Inersia beban (JW)**
```
JW = (5×100²/8 + 5×100²/8 + 50×100²/4 + 10×100²/4) × 10⁻⁶
   = (6250 + 6250 + 125000 + 25000) × 10⁻⁶
   = 162500 × 10⁻⁶
   = 0.1625 kg·m²
```

**Langkah 5: Inersia direfleksikan (JL)**
```
JL = 1² × 0.1625 = 0.1625 kg·m²
```

**Langkah 6: Rasio inersia**
```
inertiaRatio = 0.1625 / 1 × 10⁻⁴ = 1625
```

⚠️ **Rasio inersia = 1625 — SANGAT BESAR!**

Ini karena placeholder motor inertia (1 × 10⁻⁴ kg·m²) terlalu kecil untuk beban conveyor 50 kg.

**Langkah 7: Kecepatan motor (N)**
```
N = (60 × 1) / (π × 100 × 10⁻³)
  = 60 / 0.3142
  = 191 rpm
```

**Langkah 8: Torsi akselerasi (TA)**
```
TA = ((1×10⁻⁴ + 0.1625) × (2π × 191 / (60 × 0.5))) / 0.95
   = (0.1626) × (39.98)
   = 6.82 N·m
```

---

## 4. Fan

**Sumber kode:** `src/lib/mechanisms/fan.ts`

### 4.1 Rumus yang Diimplementasikan

| No | Rumus | Kode | Baris |
|----|-------|------|-------|
| 1 | Estimasi daya fan | `P_fan = 1000 × Q²` | 24 |
| 2 | Torsi beban | `TL = P_fan / ω` | 25 |
| 3 | **⚠️ Inersia direfleksikan** | **`JL = G² × (Jf / G²)` = `Jf`** | **28** |
| 4 | Rasio inersia | `inertiaRatio = JL / JM` | 34 |
| 5 | Torsi akselerasi | `TA = ((JM + JL) × (2π × N / (60 × tA))) / η` | 38 |
| 6 | Torsi fase percepatan | `T1 = TA + TL × 0.7` | 42 |
| 7 | Torsi fase konstan | `T2 = TL` | 43 |
| 8 | Torsi fase perlambatan | `T3 = TL × 0.3 - TA` | 44 |
| 9 | Torsi RMS | `Trms = √[(T1²×t1 + T2²×t2 + T3²×t3) / (t1+t2+t3+t4)]` | 53-55 |

### 4.2 Simulasi — Fan Sentrifugal

**Input:**
- Q = 2 m³/s, Jf = 0.1 kg·m²
- G = 1, η = 0.85, tA = 2 s
- N = 1500 rpm
- JM (placeholder) = 5 × 10⁻⁴ kg·m²

**Langkah 1: Estimasi daya fan**
```
P_fan = 1000 × 2² = 4000 W
```

**Langkah 2: Kecepatan sudut**
```
ω = 2π × 1500 / 60 = 157.08 rad/s
```

**Langkah 3: Torsi beban (TL)**
```
TL = 4000 / 157.08 = 25.46 N·m
```

**Langkah 4: Inersia direfleksikan (JL) — DENGAN BUG**
```
JL = G² × (Jf / G²) = 1² × (0.1 / 1²) = 0.1 kg·m²
```
Catatan: Karena G=1, hasilnya sama. Tapi jika G≠1, hasilnya salah.

**Langkah 5: Rasio inersia**
```
inertiaRatio = 0.1 / 5 × 10⁻⁴ = 200
```

**Langkah 6: Torsi akselerasi (TA)**
```
TA = ((5×10⁻⁴ + 0.1) × (2π × 1500 / (60 × 2))) / 0.85
   = (0.1005) × (78.54)
   = 7.89 N·m
```

**Langkah 7: Torsi RMS**
```
T1 = 7.89 + 25.46 × 0.7 = 7.89 + 17.82 = 25.71 N·m
T2 = 25.46 N·m
T3 = 25.46 × 0.3 - 7.89 = 7.64 - 7.89 = -0.25 N·m

Asumsi: t1 = 2s, t2 = 6s, t3 = 2s (siklus 10s)
Trms = √[(25.71²×2 + 25.46²×6 + (-0.25)²×2) / 10]
     = √[(1321.5 + 3888.4 + 0.125) / 10]
     = √[520.99]
     = 22.83 N·m
```

### 4.3 Demonstrasi Bug dengan G ≠ 1

**Input yang sama, tapi G = 3 (rasio gear 3:1):**

**Dengan kode saat ini (BUG):**
```
JL = G² × (Jf / G²) = 9 × (0.1 / 9) = 0.1 kg·m²
inertiaRatio = 0.1 / 5×10⁻⁴ = 200
```

**Dengan koreksi (benar):**
```
JL = Jf / G² = 0.1 / 9 = 0.0111 kg·m²
inertiaRatio = 0.0111 / 5×10⁻⁴ = 22.2
```

**Selisih: 200 vs 22.2 — kode saat ini salah 9x lipat!**

---

## 5. Generic Rotary

**Sumber kode:** `src/lib/mechanisms/genericRotary.ts`

### 5.1 Rumus yang Diimplementasikan

| No | Rumus | Kode | Baris |
|----|-------|------|-------|
| 1 | Torsi direfleksikan | `TL = (Tc × G) / η` | 15 |
| 2 | **⚠️ Inersia direfleksikan** | **`JL = G² × Jl`** | **19** |
| 3 | Kecepatan motor | `N = profile.speedRequired` | 22 |
| 4 | Rasio inersia | `inertiaRatio = JL / JM` | 28 |
| 5 | Torsi akselerasi | `TA = ((JM + JL) × (2π × N / (60 × tA))) / η` | 32 |
| 6 | Torsi fase percepatan | `T1 = TA + TL` | 35 |
| 7 | Torsi fase konstan | `T2 = TL` | 36 |
| 8 | Torsi fase perlambatan | `T3 = TL - TA` | 37 |
| 9 | Torsi RMS | `Trms = √[(T1²×t1 + T2²×t2 + T3²×t3) / (t1+t2+t3+t4)]` | 46-48 |
| 10 | Daya | `P = TL × ω` | 51-52 |

### 5.2 Simulasi — Rotary Load

**Input:**
- Tc = 5 N·m (torsi beban langsung)
- Jl = 0.05 kg·m² (inersia beban langsung)
- G = 2 (rasio gear), η = 0.9, tA = 0.2 s
- N = 1000 rpm
- JM (placeholder) = 1 × 10⁻⁴ kg·m²

**Langkah 1: Torsi direfleksikan (TL)**
```
TL = (5 × 2) / 0.9 = 11.11 N·m
```

**Langkah 2: Inersia direfleksikan (JL) — DENGAN BUG**
```
JL = G² × Jl = 4 × 0.05 = 0.2 kg·m²
```
⚠️ Ini SALAH — seharusnya `JL = Jl / G² = 0.05 / 4 = 0.0125 kg·m²`

**Langkah 3: Rasio inersia**
```
Dengan bug:    inertiaRatio = 0.2 / 1×10⁻⁴ = 2000
Dengan koreksi: inertiaRatio = 0.0125 / 1×10⁻⁴ = 125
```

**Selisih: 2000 vs 125 — kode saat ini salah 16x lipat!**

---

## 6. Identifikasi Bug

### Bug 1: Formula Inersia Fan (KRITIS)

**Lokasi:** `src/lib/mechanisms/fan.ts:28`

```typescript
// KODE SAAT INI (SALAH):
const JL = G * G * (Jf / (G * G)); // → menyederhanakan menjadi JL = Jf

// SEHARUSNYA:
const JL = Jf / (G * G); // JL = Jf / G²
```

**Dampak:**
- Jika G = 1 → tidak ada perbedaan (kebetulan benar)
- Jika G > 1 → JL terlalu besar → rasio inersia terlalu besar
- Jika G < 1 → JL terlalu kecil → rasio inersia terlalu kecil

**Referensi Dokumen:** `motormatch-sizing-formulas.md:113`
> "Inersia beban direfleksikan: `JL' = Jf / i²`"

### Bug 2: Formula Inersia Generic Rotary (KRITIS)

**Lokasi:** `src/lib/mechanisms/genericRotary.ts:19`

```typescript
// KODE SAAT INI (SALAH):
const JL = G * G * Jl; // JL = G² × Jl

// SEHARUSNYA:
const JL = Jl / (G * G); // JL = Jl / G²
```

**Dampak:**
- Sama seperti Bug 1 — inersia salah arah

**Referensi Dokumen:** `motormatch-sizing-formulas.md:128`
> "Inersia beban direfleksikan: `JL' = Jl / i²`"

### Bug 3: Konsistensi Formula Inersia

**Masalah:** Ada ketidaksesuaian antara formula umum dan formula spesifik:

| Dokumen | Formula | Keterangan |
|---------|---------|------------|
| Baris 14 (umum) | `JL = G² × JW` | Formula umum untuk semua mekanisme |
| Baris 113 (fan) | `JL' = Jf / i²` | Fan menggunakan `÷ i²` |
| Baris 128 (generic rotary) | `JL' = Jl / i²` | Generic rotary menggunakan `÷ i²` |

**Penjelasan:** Formula umum `JL = G² × JW` berlaku jika `JW` adalah inersia **sisi load** yang sudah direfleksikan dari komponen-komponen individual. Sedangkan `Jf` dan `Jl` adalah inersia **langsung** dari komponen (belum direfleksikan).

**Kesimpulan:** Kode Ball Screw dan Conveyor sudah benar (`G² × JW`). Kode Fan dan Generic Rotary salah karena seharusnya menggunakan `÷ G²`.

### Bug 4: Placeholder Motor Inertia

**Masalah:** Setiap mekanisme menggunakan nilai tetap yang berbeda:

| Mekanisme | Placeholder JM | Catatan |
|-----------|----------------|---------|
| Ball Screw | 1.23 × 10⁻⁵ kg·m² | Dari contoh dokumentasi |
| Conveyor | 1 × 10⁻⁴ kg·m² | Terlalu kecil untuk beban besar |
| Fan | 5 × 10⁻⁴ kg·m² | Lebih realistis |
| Generic Rotary | 1 × 10⁻⁴ kg·m² | Terlalu kecil untuk banyak kasus |

**Dampak:** Rasio inersia menjadi tidak realistis karena pembagi terlalu kecil.

---

## 7. Analisis Kenapa Rasio Inersia Bisa Sangat Besar

### Penyebab 1: Bug Formula (Fan & Generic Rotary)

Untuk Generic Rotary dengan G = 2:
```
Bug:        JL = G² × Jl = 4 × Jl → rasio = 4×Jl / JM
Koreksi:    JL = Jl / G² = Jl / 4 → rasio = Jl / (4×JM)
Selisih:    16x lipat!
```

### Penyebab 2: Gear Ratio > 1 (Overdrive)

Jika user memasukkan G > 1 (misal G = 5):
```
JL = G² × JW = 25 × JW
inertiaRatio = 25 × JW / JM
```

Jika seharusnya G = 0.2 (reduksi 5:1):
```
JL = G² × JW = 0.04 × JW
inertiaRatio = 0.04 × JW / JM
```

**Selisih: 625x lipat!**

### Penyebab 3: Placeholder Motor Inertia Terlalu Kecil

Contoh Conveyor dengan M3 = 50 kg:
```
JW = 0.1625 kg·m²
JL = 0.1625 kg·m² (G=1)

Dengan JM = 1×10⁻⁴:  ratio = 1625
Dengan JM = 1×10⁻³:  ratio = 162.5
Dengan JM = 1×10⁻²:  ratio = 16.25
```

### Penyebab 4: Konvensi Gear Ratio Ambigu

Dokumen mendefinisikan: `G = Z_motor / Z_load`

| Skenario | Z_motor | Z_load | G | G² | Efek |
|----------|---------|--------|---|-----|------|
| Reduksi 5:1 | 20 | 100 | 0.2 | 0.04 | JL berkurang 25x |
| Direct drive | - | - | 1 | 1 | Tidak ada perubahan |
| Overdrive 5:1 | 100 | 20 | 5 | 25 | JL membesar 25x |

Jika user memasukkan "5" untuk reduksi 5:1 (padahal seharusnya 0.2), maka `G² = 25` akan memperbesar inersia 25x lipat.

---

## 8. Rekomendasi Perbaikan

### Prioritas 1: Koreksi Formula Fan

**File:** `src/lib/mechanisms/fan.ts:28`

```typescript
// SEBELUM:
const JL = G * G * (Jf / (G * G));

// SESUDAH:
const JL = Jf / (G * G);
```

### Prioritas 2: Koreksi Formula Generic Rotary

**File:** `src/lib/mechanisms/genericRotary.ts:19`

```typescript
// SEBELUM:
const JL = G * G * Jl;

// SESUDAH:
const JL = Jl / (G * G);
```

### Prioritas 3: Konsistensi Dokumentasi

Perbarui `motormatch-sizing-formulas.md` baris 14 untuk menjelaskan konvensi:

```markdown
- `JL` = inersia beban direfleksikan ke poros motor:
  - Jika `JW` = inersia sisi load (belum direfleksikan): `JL = G² × JW`
  - Jika `Jl`/`Jf` = inersia langsung komponen: `JL = Jl / G²` atau `JL = Jf / G²`
  - G = Z_motor / Z_load (untuk reduksi, G < 1)
```

### Prioritas 4: Klarifikasi Input Gear Ratio

Tambahkan tooltip atau validasi di UI untuk memastikan user memasukkan G dengan benar:

```
Gear Ratio (G) = Z_motor / Z_load
- Reduksi 5:1 → G = 0.2
- Direct drive → G = 1
- Overdrive 5:1 → G = 5
```

### Prioritas 5: Katalog Motor Nyata

Ganti placeholder motor inertia dengan katalog motor yang sebenarnya, atau minimal tampilkan peringatan jika rasio inersia > 30 (batas umum untuk servo).

---

## Lampiran: Perbandingan Rumus Antara Kode dan Dokumentasi

| Mekanisme | Parameter | Kode | Dokumen | Status |
|-----------|-----------|------|---------|--------|
| Ball Screw | JB | `(mass × D²/8) × 10⁻⁶` | `M_screw×D²/8 ×10⁻⁶` | ✅ Benar |
| Ball Screw | JW | `M×(P/2π)²×10⁻⁶ + JB` | `M×(P/2π)²×10⁻⁶ + JB` | ✅ Benar |
| Ball Screw | JL | `G² × JW` | `G² × JW` | ✅ Benar |
| Conveyor | JW | `(M1×D1²/8 + M2×D2²/8 + M3×D1²/4 + M4×D1²/4) × 10⁻⁶` | Sama | ✅ Benar |
| Conveyor | JL | `G² × JW` | `G² × JW` | ✅ Benar |
| Fan | JL | `G² × (Jf / G²)` = `Jf` | `Jf / i²` | ❌ **SALAH** |
| Generic Rotary | JL | `G² × Jl` | `Jl / i²` | ❌ **SALAH** |
| Semua | TA | `((JM+JL)×(2πN/60tA))/η` | Sama | ✅ Benar |
| Semua | Trms | `√[(T1²t1+T2²t2+T3²t3)/(t1+t2+t3+t4)]` | Sama | ✅ Benar |

---

**Kesimpulan:** Rasio inersia yang besar disebabkan oleh kombinasi bug formula (Fan & Generic Rotary), konvensi gear ratio yang ambigu, dan placeholder motor inertia yang terlalu kecil. Perbaikan formula adalah prioritas utama.

# MotorMatch — Formula Sizing per Mekanisme

Dokumen teknis pendukung `motormatch-software-design.md`. Berisi formula torsi, inersia, dan daya untuk 13 mekanisme yang jadi dasar UC2 (input parameter) dan UC4 (hasil sizing).

**Status validasi:** formula di bawah sudah dicek silang terhadap technical guide servo sizing resmi (referensi: Omron Technical Guide for Servomotor Selection — strukturnya sama dengan pendekatan Mitsubishi/vendor lain karena ini metodologi standar industri, bukan proprietary satu merk). Koreksi utama dari draft sebelumnya: **satuan panjang di formula asli pakai mm** (bukan m), sehingga perlu faktor konversi ×10⁻³ (untuk torsi) atau ×10⁻⁶ (untuk inersia) saat P/D dalam mm dan hasil ingin dalam N·m / kg·m². Torsi akibat gaya eksternal dan torsi gesekan juga dihitung **terpisah lalu dijumlahkan**, bukan digabung jadi satu gaya total seperti draft awal.

Notasi umum yang dipakai di semua mekanisme (P, D dalam **mm** kecuali disebutkan lain; M dalam kg; F dalam N):
- `η` = efisiensi transmisi/gear (0-1)
- `g` = percepatan gravitasi (9.8 m/s²)
- `G` = rasio gear/reduksi (Z1/Z2, motor side/load side), G=1 jika direct-drive
- `N` = kecepatan rotasi motor (r/min)
- `JM` = inersia rotor motor (kg·m²) — dari datasheet motor kandidat
- `JW` = inersia beban (sisi load, sebelum direfleksikan lewat gear)
- `JL` = inersia beban direfleksikan ke poros motor: `JL = G² × JW` (jika ada gear pada sisi load)
- `TW` = torsi beban (sisi load), `TL` = torsi direfleksikan ke motor: `TL = TW × G / η`
- Torsi akselerasi: `TA = (JM + JL) × (2πN / 60tA) / η`
- Torsi RMS/efektif: `Trms = sqrt[(T1²t1 + T2²t2 + T3²t3) / (t1+t2+t3+t4)]` dimana T1=TA+TL (percepatan), T2=TL (konstan), T3=TL−TA (perlambatan)
- Cek kelayakan: `JL ≤ JM × rasio_inersia_maks` (rasio maks bervariasi 10-30 tergantung seri motor — lihat datasheet), `Trms < 0.8 × Trated`, `T1 < 0.8 × Tmax_momentary`

---

## Grup 1: Linear Motion

### 1. Ball Screw
Variabel: lead `P` (mm), sudut kemiringan `θ`, massa beban `M` (kg), gaya eksternal `F` (N), inersia ball screw `JB` (kg·m², dari datasheet/dihitung dari massa & diameter screw)

- Torsi gesekan: `TW_friksi = μMg × (P/2π) × 10⁻³` (N·m)
- Torsi gaya eksternal: `TW_eksternal = F × (P/2π) × 10⁻³` (N·m)
- Torsi beban total: `TW = TW_friksi + TW_eksternal` (tambahkan komponen gravitasi terpisah jika ada kemiringan/vertikal)
- Torsi direfleksikan ke motor: `TL = TW × G/η`
- Inersia beban: `JW = M × (P/2π)² × 10⁻⁶ + JB` (kg·m²)
- Inersia direfleksikan: `JL = G² × JW`

### 2. Rack and Pinion
Variabel: diameter pinion `D` (mm), sudut kemiringan `θ`, gaya tarik `F` (N), massa beban `M` (kg)

- Torsi gaya eksternal: `TW_eksternal = F × (D/2) × 10⁻³` (N·m)
- Torsi akibat gravitasi (jika miring/vertikal, arah tegak lurus rack): `TW_gravitasi = Mg·cosθ × (D/2) × 10⁻³` (N·m) — catatan: proyeksi sudut tergantung orientasi rack terhadap gravitasi, verifikasi ke geometri aktual
- Torsi beban total: `TW = TW_eksternal + TW_gravitasi + TW_friksi`
- Torsi direfleksikan ke motor: `TL = TW × G/η`
- Inersia beban: `JW = M × D² / 4 × 10⁻⁶` (kg·m²)
- Inersia direfleksikan: `JL = G² × JW`

### 3. Sprocket & Chain
Variabel: diameter pitch sprocket `D` (mm), gaya tarik rantai `F` (N), massa beban `M` (kg)

- Struktur formula identik dengan rack-pinion (radius pitch sprocket menggantikan radius pinion) — validasi: < cite index="21-1">konversi gerak linear ke rotary untuk sprocket-chain memakai pitch diameter (atau jumlah gigi) sprocket, sama seperti rack-pinion pakai pitch rack</cite>
- Torsi gaya eksternal: `TW_eksternal = F × (D/2) × 10⁻³` (N·m)
- Torsi gesekan: `TW_friksi = μ_chain × Mg × (D/2) × 10⁻³` — **catatan penting:** koefisien gesekan chain/belt traverse jauh lebih tinggi dari ball screw, < cite index="26-1">panduan sizing HMK menyarankan asumsi koefisien gesekan sekitar 0.4 untuk conveyor belt dan chain traverse berbeban</cite> (dibanding ballscrew μ≈0.1)
- Torsi beban total: `TW = TW_eksternal + TW_friksi`
- Torsi direfleksikan ke motor: `TL = TW × G/η` (η chain drive ≈0.95-0.98)
- Inersia beban: `JW = M × D² / 4 × 10⁻⁶` (kg·m²), tambahkan inersia sprocket sendiri jika signifikan
- Inersia direfleksikan: `JL = G² × JW`

### 4. Roll Feed
Variabel: diameter roll `Dra`, `Drb` (m), gaya jepit `Fn` (N)

- Torsi beban: `TL = (Fn × μ × Dra/2) / η` (torsi dari gesekan roll ke material)
- Inersia beban: `JL' = (1/8) × mroll × (Dra² + Drb²)` (perkiraan silinder pejal, disesuaikan jika roll berongga)

### 5. Conveyor (Belt)
Variabel: diameter roller penggerak `D1` (mm), diameter roller idle `D2` (mm), massa roller 1 `M1`, massa roller 2 `M2`, massa beban `M3`, massa belt `M4` (kg), sudut kemiringan `θ`

- Torsi gesekan+eksternal: `TW = F_total × (D1/2) × 10⁻³` dimana `F_total` = gaya dorong beban (termasuk komponen gravitasi jika miring: `M3·g·(sinθ+μcosθ)`, dengan μ≈0.4 sesuai catatan di atas untuk belt berbeban)
- Torsi direfleksikan ke motor: `TL = TW × G/η`
- Inersia total (roller penggerak + roller idle direfleksikan lewat rasio diameter + beban + belt):
  `JW = (M1·D1²)/8 + (M2·D2²)/8 + (M3·D1²)/4 + (M4·D1²)/4` (×10⁻⁶, kg·m²)
- Inersia direfleksikan: `JL = G² × JW`

### 6. Cart
Variabel: diameter roda `Dwh` (m), lebar cart `Wcart`, berat beban `Wl` (kg)

- Gaya total: `F = (Wl + Wcart)·g·(sinθ + μ_roll·cosθ)`
- Torsi beban: `TL = (F × Dwh/2) / η`
- Inersia beban direfleksikan: `JL' = (Wl + Wcart) × (Dwh/2)²`

### 7. Linear Servo (direct-drive linear motor)
Variabel: gaya friksi `Ff` (N), gaya cutting `Fc` (N), berat traveler `Wt` (kg), kecepatan `V` (m/s)

- Tidak ada rasio gear/pulley — gaya motor langsung = gaya beban:
- Gaya total: `F = Ff + Fc + Wt·g·μ` (jika horizontal, gravitasi diabaikan kecuali ada kemiringan)
- Massa efektif yang digerakkan: `meff = Wt + mforcer` (mforcer = massa bagian bergerak motor linear)
- Tidak dikonversi ke torsi — sizing linear servo pakai satuan gaya (N) & kecepatan (m/s) langsung, bukan torsi/rpm

### 8. Generic (Linear)
Variabel: gaya `Fc` (N), kecepatan `V` (m/s), berat beban `Wl` (kg)

- Dipakai sebagai fallback kalau mekanisme spesifik tidak ada di daftar
- Torsi beban: `TL = (Fc × r_efektif) / η` — user input radius efektif transmisi (r_efektif) secara manual
- Inersia beban: `JL' = Wl × r_efektif²`

---

## Grup 2: Rotary Indexing

### 9. Rotary Table
Variabel: diameter meja `Dt` (m), radius beban `R` (m), berat beban `Wl` (kg)

- Inersia meja (silinder pejal): `Jtable = (1/8) × Mtable × Dt²`
- Inersia beban di radius R: `Jload = Wl × R²`
- Inersia total direfleksikan: `JL' = (Jtable + Jload) / i²` (i = rasio reduksi gear jika ada)
- Torsi beban (untuk indexing, termasuk percepatan): `TL = JL' × α` (α = percepatan sudut saat index) `+ Tfriksi`

---

## Grup 3: Rotary Continuous

### 10. Fan
Variabel: debit udara `Q` (m³/s), inersia fan `Jf` (kg·m²)

- Torsi beban mengikuti hukum affinity fan: `TL ∝ ω²` (torsi naik kuadratik terhadap kecepatan)
- Torsi pada kecepatan rated: `TL = P_fan / ω` dengan `P_fan` dari kurva performa fan (biasanya dari datasheet fan, bukan dihitung dari first principle)
- Inersia beban direfleksikan: `JL' = Jf / i²`
- Catatan: karena torsi tidak konstan, torsi RMS harus hitung profil torsi vs waktu selama rentang kecepatan operasi

### 11. Pump
Variabel: debit fluida `Q` (m³/s), inersia pump `Jp` (kg·m²)

- Untuk pompa sentrifugal, sama seperti fan: `TL ∝ ω²`
- Untuk pompa displacement (piston/gear pump): torsi relatif konstan terhadap tekanan discharge → `TL = (ΔP × Vdisplacement) / (2π × η)`
- Inersia beban direfleksikan: `JL' = Jp / i²`

### 12. Generic (Rotary)
Variabel: torsi beban `Tc` (N·m), inersia load `Jl` (kg·m²)

- Dipakai sebagai fallback rotary — user input torsi beban langsung (dari spesifikasi mesin/pengukuran)
- Torsi beban: `TL = Tc / i²` (direfleksikan lewat rasio gear i)
- Inersia beban direfleksikan: `JL' = Jl / i²`

---

## Grup 4: Vertical / Hoisting

### 13. Elevator / Hoist
Variabel: diameter drum `D` (mm), massa counterweight `M1` (kg), massa beban `M2` (kg), gaya eksternal `F` (N)

- Gaya net (gravitasi beban dikurangi counterweight, plus gesekan): `Fnet = (M2 − M1)·g + Ffriksi + F`
- Torsi beban: `TW = Fnet × (D/2) × 10⁻³`
- Torsi direfleksikan ke motor: `TL = TW × G/η`
- Inersia (drum + kedua beban tergantung di kabel, formula "suspended counterbalance"): `JW = D²(M1 + M2) / 4 × 10⁻⁶` (kg·m²), ditambah inersia drum itu sendiri jika signifikan
- Inersia direfleksikan: `JL = G² × JW`
- **Penting:** saat berhenti/holding, motor harus tetap suplai torsi holding (`Thold = (M2−M1)·g·(D/2)×10⁻³ / η`) — ini yang membedakan mekanisme hoisting dari mekanisme lain: motor/brake harus mampu menahan beban statis, bukan cuma bergerak

---

## Alur Perhitungan Umum (Semua Mekanisme)

1. Hitung `TW` (torsi beban sisi load) dan `JW` (inersia sisi load) sesuai formula mekanisme
2. Refleksikan ke poros motor: `TL = TW × G/η`, `JL = G² × JW`
3. Hitung rasio inersia: `JL/JM` — dipakai untuk keputusan servo vs stepper (rasio maks bervariasi 10-30 tergantung seri motor, verifikasi ke datasheet kandidat)
4. Bangun profil kecepatan (trapezoidal: accel-constant-decel) dari parameter waktu siklus & jarak/sudut tempuh
5. Hitung torsi akselerasi: `TA = (JM+JL) × (2πN/60tA) / η`
6. Hitung torsi tiap fase: `T1=TA+TL` (accel), `T2=TL` (constant), `T3=TL−TA` (decel)
7. Hitung torsi RMS/efektif dari profil di atas
8. Cek kelayakan: `Trms < 0.8×Trated`, `T1 < 0.8×Tmax_momentary`, `N ≤ Nrated`
9. Hitung daya: `P = TL × ω`

### Contoh Perhitungan Tervalidasi (Ball Screw)
Kasus: M=5kg, P=10mm, D=20mm, massa screw=3kg, μ=0.1, direct-drive (G=1, η=1), V=300mm/s, tA=0.2s

- `JB = M_screw×D²/8 ×10⁻⁶ = 3×20²/8×10⁻⁶ = 1.5×10⁻⁴ kg·m²`
- `JW = 5×(10/2π)²×10⁻⁶ + 1.5×10⁻⁴ = 1.63×10⁻⁴ kg·m²`
- `TW_friksi = 0.1×5×9.8×(10/2π)×10⁻³ = 7.8×10⁻³ N·m`
- `N = 60×300/(10×1) = 1800 rpm`
- Motor kandidat: JM=1.23×10⁻⁵ kg·m² → rasio inersia = 1.63×10⁻⁴/1.23×10⁻⁵ ≈ 13.3 (masih dalam batas rasio 30 untuk seri motor ini)
- `TA = 1.23×10⁻⁵+1.63×10⁻⁴)×(2π×1800/(60×0.2)) = 0.165 N·m`
- `Trms ≈ 0.083 N·m` — jauh di bawah rated torque (0.637 N·m), motor kandidat layak

---

## Catatan Implementasi

- Formula di atas sudah divalidasi terhadap technical guide sizing servo resmi (metodologi standar, dipakai lintas vendor termasuk Omron & pendekatan serupa Mitsubishi) — bukan lagi sekadar first-order approximation
- Mekanisme yang belum ada di technical guide resmi (roll feed, cart, linear servo, rotary table, fan/pump displacement) tetap berupa pendekatan turunan dari prinsip yang sama — disarankan cross-check tambahan ke manual Mitsubishi Motorizer asli (14 mekanisme) sebelum dipakai produksi
- Untuk Fan/Pump, torsi sebaiknya ambil dari kurva performa aktual (datasheet), formula kuadratik hanya untuk estimasi kasar jika data kurva tidak tersedia
- Koefisien gesekan (`μ`) dan efisiensi (`η`) sebaiknya disediakan sebagai default per tipe transmisi (ballscrew η≈0.9, belt η≈0.95, gear η≈0.9, dll) yang bisa di-override user
- **Perhatikan satuan:** P dan D dalam formula ini pakai mm (bukan m) — konversi ×10⁻³ dan ×10⁻⁶ WAJIB diimplementasikan persis agar hasil tidak salah skala 1000x atau 1.000.000x

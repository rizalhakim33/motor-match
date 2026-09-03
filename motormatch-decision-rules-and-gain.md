# MotorMatch — Decision Rules & Starting-Point Gain Calculator

Dokumen teknis pendukung ketiga, setelah `motormatch-software-design.md` dan `motormatch-sizing-formulas.md`. Berisi logika UC3 (rekomendasi jenis motor) dan UC10 (starting-point gain calculator).

---

## 1. Decision Rules — Servo vs Stepper vs Induksi+VFD

Urutan evaluasi (top-down, berhenti di aturan pertama yang match):

| Prioritas | Kondisi | Rekomendasi | Alasan |
|---|---|---|---|
| 1 | Mekanisme = Fan atau Pump, tidak butuh posisi presisi | **Induksi + VFD** | Continuous run, torsi/kecepatan variabel tanpa perlu feedback posisi |
| 2 | Mekanisme = Conveyor/Cart, kecepatan konstan, tidak ada positioning presisi | **Induksi + VFD** | Beban umumnya besar, siklus terus-menerus, biaya lebih rendah |
| 3 | Butuh presisi posisi TINGGI | **Servo** | Butuh closed-loop untuk positioning presisi |
| 4 | Mekanisme = Elevator/hoist | **Servo dengan holding brake** (default) atau **Induksi+VFD dengan brake** (jika hanya butuh kecepatan konstan naik-turun tanpa presisi posisi) | Butuh torsi holding saat berhenti — brake wajib, jenis motor tergantung presisi posisi |
| 5 | Tidak match kondisi manapun (fallback) | **Servo** dengan catatan "perlu review manual" | Default paling aman/serbaguna jika sistem tidak yakin |

**Parameter kunci yang dipakai decision engine:**
- `needsPrecisePosition` (boolean, dari UC2)
- `repeatabilityRequired` (opsional, mm atau derajat)
- `dutyCycle` / `continuousRun` (boolean)

**Catatan Phase 1 (MVP):**
- **Rasio inersia (JL/JM)** dan **Torsi Akselerasi (TA)** belum dihitung karena membutuhkan data inersia motor (JM) dari katalog motor riil.
- Untuk sementara, rekomendasi hanya berdasarkan jenis mekanisme dan kebutuhan presisi posisi.
- **Phase 2:** Aktifkan kembali perhitungan inertiaRatio & TA setelah katalog motor (UC5) diimplementasikan. Saat itu, tambahkan kembali syarat `inertiaRatio > 10` pada Rule 3 untuk membedakan servo vs stepper.

---

## 1a. Ringkasan Aturan (untuk UI)

```
Fan/Pump without precision → Induction + VFD
Conveyor/Cart without precision → Induction + VFD
High precision positioning → Servo (rasio inersia perlu verifikasi manual)
Elevator/Hoist → Servo with holding brake
Default → Servo (review manually)
```

---

## 2. Starting-Point Gain Calculator (UC10)

Berlaku hanya jika rekomendasi = **Servo**. Berbasis teori kontrol cascade P-PI (posisi → kecepatan → arus), yang jadi standar mayoritas servo drive modern.

### 2.1 Asumsi Model
Sistem 2-inersia disederhanakan jadi 1-inersia efektif (rigid body assumption):

`Jtotal = Jm + JL'` (motor + beban direfleksikan)

### 2.2 Speed Loop Gain (Kv)
Berdasarkan bandwidth kecepatan yang diinginkan `ωv` (rad/s), biasanya ditentukan dari kebutuhan respons:

`Kv = ωv × Jtotal / Kt`

dimana `Kt` = torque constant motor (N·m/A, dari datasheet)

Rule of thumb pemilihan `ωv` awal berdasar rasio inersia:
| Rasio inersia JL'/Jm | ωv awal disarankan |
|---|---|
| < 3 (beban ringan) | 100-150 rad/s |
| 3-10 (beban sedang) | 50-100 rad/s |
| > 10 (beban berat) | 20-50 rad/s (butuh tuning lebih hati-hati / pertimbangkan gear reduction) |

### 2.3 Speed Loop Integral Time (Tvi / Tn)
`Tvi = k × (Jtotal / (Kv × Kt))`, dengan `k` = konstanta damping (umumnya 2-4 untuk damping ratio ~0.7-1.0)

### 2.4 Position Loop Gain (Kp)
`Kp = ωv / 4` sampai `ωv / 6` (position loop bandwidth harus lebih rendah dari speed loop untuk stabilitas cascade, rasio 1:4 - 1:6 adalah rule of thumb umum)

### 2.5 Konversi ke "Dialek" Merk (contoh output UI)

| Parameter generik | Baumüller (BM5000/5500) | Mitsubishi (MR-J) | Format umum lain |
|---|---|---|---|
| Kv (speed loop gain) | `Kv` (rad/s) langsung | Speed Gain 1 (PB) — konversi: `PB ≈ Kv × Jtotal/Kt × faktor_skala_MR-J` | INVT: `Pn.speed-gain` (level 1-30, mapping non-linear dari datasheet) |
| Tvi (integral time) | `Tn` (ms) | Speed Integral Compensation (dalam ms, biasanya = Tvi langsung) | — |
| Kp (position gain) | `Kp` (1/s) | Position Loop Gain (PA, rad/s) | — |

**Catatan penting:** mapping ke gain level Mitsubishi/INVT (skala 1-30 atau serupa) itu proprietary dan non-linear — sistem hanya bisa kasih **perkiraan kasar** berdasarkan tabel referensi dari manual masing-masing merk, bukan konversi eksak. Ini harus ditampilkan sebagai disclaimer di UI: *"Nilai merupakan starting point, verifikasi dan fine-tuning tetap perlu dilakukan di lapangan."*

### 2.6 Yang TIDAK dihitung sistem (di luar scope)
- Notch filter untuk resonansi mekanis (butuh pengukuran frekuensi resonansi aktual di lapangan)
- Feedforward gain (butuh profil gerak detail per aplikasi)
- Auto-tuning real-time (butuh koneksi live ke drive)

---

## 3. Alur Kalkulasi Gabungan (UC1 → UC10)

```
Pilih mekanisme (UC1)
  → Input parameter (UC2)
  → Hitung TL, JL' (formula sizing per mekanisme)
  → Decision rules → tentukan servo/stepper/induksi+VFD (UC3)
  → Pilih kandidat motor dari katalog berdasar TL, kecepatan, JL'/Jm (UC4/UC5)
  → [JIKA servo] Hitung Kv, Tvi, Kp dari Jtotal & Kt motor terpilih (UC10)
  → Tampilkan hasil + dialek multi-merk + disclaimer
```

---

## Catatan Implementasi
- Decision rules di atas adalah rule-based (if-else), cukup untuk MVP — bisa diperhalus jadi scoring/weighted system di iterasi berikutnya jika perlu nuansa lebih (mis. mempertimbangkan biaya, ketersediaan part lokal)
- Formula gain adalah pendekatan standar cascade P-PI (banyak dipakai literatur servo tuning umum) — bukan algoritma proprietary vendor manapun, jadi aman dari sisi IP

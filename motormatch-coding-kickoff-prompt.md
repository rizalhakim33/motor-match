# Starter Prompt — MotorMatch MVP Kick-off

Salin/paste prompt di bawah ini ke coding assistant (Claude Code, Cursor, dll), setelah 3 file dokumen (`motorizer-software-design.md`, `motormatch-sizing-formulas.md`, `motormatch-decision-rules-and-gain.md`) sudah di-upload atau ditaruh di folder `/docs` project.

---

## PROMPT

Saya mau bangun MVP web app bernama **MotorMatch** — tools untuk memilih jenis motor (servo/stepper/induksi+VFD) berdasarkan mekanisme mesin dan parameter beban, lalu menghitung sizing dasar. Spesifikasi lengkap ada di 3 file docs: `motorizer-software-design.md` (arsitektur, use case, roadmap), `motormatch-sizing-formulas.md` (formula per mekanisme), `motormatch-decision-rules-and-gain.md` (aturan pemilihan motor).

**Scope MVP (ikuti fase "MVP" di roadmap dokumen desain):**
- Implementasikan UC1-UC4 saja: pilih mekanisme → input parameter → hitung rekomendasi jenis motor → tampilkan hasil sizing
- Tanpa login, tanpa database motor riil (UC5-UC9 skip dulu)
- Mulai dari 4 mekanisme prioritas dulu: **Ball Screw, Conveyor (Belt), Generic (Rotary), Fan** — mekanisme lain menyusul di iterasi berikutnya
- Rekomendasi jenis motor pakai decision rules dari `motormatch-decision-rules-and-gain.md` bagian 1 (belum perlu UC10/gain calculator dulu)

**Stack:**
- Next.js + TypeScript
- Form wizard step-by-step (App Router, client component untuk state wizard)
- Semua kalkulasi jalan client-side (tidak perlu backend/database untuk MVP)
- Styling: Tailwind CSS

**Struktur yang diinginkan:**
- `lib/mechanisms/` — satu file per mekanisme, isi fungsi kalkulasi torsi & inersia sesuai formula di dokumen (mis. `ballscrew.ts`, `conveyor.ts`, `genericRotary.ts`, `fan.ts`)
- `lib/decisionRules.ts` — logika if-else pemilihan servo/stepper/induksi+VFD
- `components/wizard/` — step components (StepMechanism, StepParameters, StepResult)
- Tipe data ikuti class diagram di dokumen desain (`MechanismProfile`, `SizingResult`, dll) — buat sebagai TypeScript interface di `types/`

**Penting:**
- Perhatikan satuan di formula: panjang/diameter dalam mm, hasil torsi dalam N·m, inersia dalam kg·m² — implementasikan faktor konversi (×10⁻³, ×10⁻⁶) persis seperti di dokumen, jangan diasumsikan ulang
- Pakai contoh perhitungan numerik ball screw di dokumen formula sebagai basis unit test, supaya kalkulasi tervalidasi sejak awal
- Tanya saya dulu kalau ada bagian requirement yang ambigu, jangan diasumsikan sendiri

Mulai dari setup project + struktur folder, lalu implementasi 1 mekanisme dulu (ball screw) end-to-end sebelum lanjut ke mekanisme lain, supaya polanya bisa direview dulu.

---

## Catatan Tambahan (bukan bagian prompt, untuk diri sendiri)
- Setelah 4 mekanisme prioritas jalan, minta tambah mekanisme lain satu-satu sambil sertakan bagian formula terkait dari dokumen
- Untuk unit test, pakai contoh angka ball screw yang sudah ada di `motormatch-sizing-formulas.md` (M=5kg, P=10mm, dst) sebagai assertion pertama
- Setelah UC1-UC4 stabil baru lanjut prompt terpisah untuk UC10 (gain calculator) memakai bagian 2 dari `motormatch-decision-rules-and-gain.md`

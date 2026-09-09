import MotorWizard from "@/components/wizard/MotorWizard";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-50">
      <MotorWizard />

      {/* SEO static content - crawlable but not in header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-white rounded-2xl shadow-soft border border-surface-200/70 p-6 md:p-8 mt-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-surface-900">
            Kalkulator Sizing Motor Servo, Stepper &amp; Induksi + VFD Gratis
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-surface-600">
            MotorMatch membantu engineer memilih dan sizing motor berdasarkan mekanisme dan parameter
            beban. Hitung <strong>torsi</strong>, <strong>inertia ratio (JL/JM)</strong>,{" "}
            <strong>peak &amp; RMS torque</strong>, duty cycle, dan rekomendasi tipe motor untuk 13
            mekanisme — Ball Screw, Rack &amp; Pinion, Conveyor, Rotary Table, Fan, Pump, Elevator,
            dan lainnya. Dilengkapi katalog motor Mitsubishi, Yaskawa, Delta, Panasonic, Omron, serta
            starting-point gain servo (Kv, Tvi, Kp).
          </p>

          <h2 className="mt-6 text-lg font-semibold text-surface-900">Kenapa pakai MotorMatch?</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-3 text-sm text-surface-600">
            <li className="flex gap-2">
              <span className="text-primary-600">•</span>
              <span>
                <strong>13 mekanisme lengkap:</strong> Ball Screw, Rack &amp; Pinion, Roll Feed,
                Sprocket &amp; Chain, Conveyor, Cart, Linear Servo, Generic Linear/Rotary, Rotary
                Table, Fan, Pump, Elevator/Hoist.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600">•</span>
              <span>
                <strong>Rekomendasi tipe motor:</strong> servo / stepper / induksi + VFD dengan alasan
                dan kandidat katalog.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600">•</span>
              <span>
                <strong>Full sizing 4 fase:</strong> TL, JL, N, TA, peak &amp; RMS torque, inertia
                ratio, dan cek duty cycle.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600">•</span>
              <span>
                <strong>Gain calculator:</strong> Kv, Tvi, Kp + konversi per brand (Mitsubishi,
                Yaskawa, Delta, Panasonic, Omron, Baumüller).
              </span>
            </li>
          </ul>

          <h3 className="mt-6 text-base font-semibold text-surface-900">
            Cocok untuk engineer automation &amp; desain mesin
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-surface-600">
            Dirancang untuk tahap desain awal sebelum fine-tuning di lapangan. Masukkan kecepatan,
            cycle time, gear ratio, efisiensi, dan parameter spesifik mekanisme — langsung dapatkan
            perbandingan motor, chart torsi, dan export PDF.
          </p>

          <details className="mt-6 group">
            <summary className="cursor-pointer text-sm font-medium text-primary-700 hover:text-primary-800">
              FAQ — Pertanyaan umum seputar sizing motor
            </summary>
            <div className="mt-3 space-y-3 text-sm text-surface-600">
              <div>
                <p className="font-medium text-surface-800">Apa itu inertia ratio dan kenapa penting?</p>
                <p>
                  Inertia ratio (JL/JM) adalah perbandingan inertia beban terhadap inertia motor.
                  Ratio yang terlalu tinggi membuat respon servo lambat dan overshoot. MotorMatch
                  menghitung JL otomatis dan memberi warning jika ratio di luar rekomendasi.
                </p>
              </div>
              <div>
                <p className="font-medium text-surface-800">Kapan pilih servo vs stepper vs induksi+VFD?</p>
                <p>
                  Servo untuk presisi &amp; dinamika tinggi, stepper untuk cost-effective dengan
                  positioning sederhana, induksi+VFD untuk daya besar &amp; operasi kontinyu seperti
                  Fan/Pump/Conveyor.
                </p>
              </div>
              <div>
                <p className="font-medium text-surface-800">Apakah hasil sizing bisa langsung dipakai beli motor?</p>
                <p>
                  Hasil adalah starting point engineering berbasis formula standar industri. Selalu
                  validasi dengan datasheet resmi dan pertimbangkan safety factor sebelum pembelian.
                </p>
              </div>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

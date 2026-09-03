import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-7xl font-black text-surface-200">404</span>
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-surface-500 mb-8">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

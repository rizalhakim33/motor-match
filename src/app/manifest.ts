import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MotorMatch - Kalkulator Sizing Motor",
    short_name: "MotorMatch",
    description:
      "Kalkulator sizing motor servo, stepper & induksi+VFD untuk engineer. 13 mekanisme, katalog motor, perhitungan torsi & inertia.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

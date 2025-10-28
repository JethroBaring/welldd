import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image
              src="/fullname-teal-logo.png"
              alt="Logo"
              width={90}
              height={45}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="hidden lg:flex h-full w-full items-center justify-center bg-gray-900 relative">
          {/* Radial Gradient Background - Optimized Mid-Tone Colors */}
          <div
            className="absolute inset-0 z-0"
            style={{
              // Balanced colors: lighter than the first suggestion, but darker than the last
              background: 'radial-gradient(circle at center, #3ba6b8 0%, #297a8a 50%, #1e5c6a 100%)'
            }}
          ></div>

          {/* Abstract Connections/Grid Pattern */}
          <div className="absolute inset-0 z-10 opacity-30">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  {/* Subtle line color that works well against the mid-tone background */}
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#68b8cc" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Logo and Text Overlay - Centered on the Background */}
          <div className="z-20 flex flex-col items-center justify-center text-white gap-2">
            {/* Text colors are set to white/light teal for contrast */}
            <Image
              src="/white-logo.png"
              alt="Logo"
              width={120}
              height={60}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
            <p className="mt-2 max-w-sm text-center text-white">
              Internal Inventory & Medical Record System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

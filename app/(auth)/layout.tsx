import Image from "next/image";
import "./auth.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image
              src="/fullname-teal-logo.png"
              alt="Logo"
              width={1000}
              height={1000}
              style={{ borderRadius: "8px", objectFit: "cover" }}
              className="w-32"
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
        <div className="hero-container">
          <div className="graphic-wrapper">
            <div className="cross">
              <div className="cross-horizontal"></div>
              <div className="cross-vertical"></div>
            </div>

            <div className="chart">
              <div className="chart-bars">
                <div className="chart-bar chart-bar-1"></div>
                <div className="chart-bar chart-bar-2"></div>
                <div className="chart-bar chart-bar-3"></div>
                <div className="chart-bar chart-bar-4"></div>
              </div>
            </div>

            <div className="clipboard">
              <div className="clipboard-clip"></div>
              <div className="clipboard-line"></div>
              <div className="clipboard-line"></div>
              <div className="clipboard-line"></div>
            </div>

            <div className="record record-3">
              <div className="record-line"></div>
              <div className="record-line"></div>
              <div className="record-line"></div>
            </div>

            <div className="thermometer">
              <div className="thermometer-tube">
                <div className="thermometer-mercury"></div>
              </div>
              <div className="thermometer-bulb"></div>
            </div>

            <div className="circle"></div>

            <div className="iv-bag">
              <div className="iv-bag-container">
                <div className="iv-bag-tab"></div>
                <div className="iv-bag-liquid"></div>
              </div>
            </div>

            <div className="pill">
              <div className="pill-half"></div>
              <div className="pill-border"></div>
            </div>

            <svg className="heartbeat" viewBox="0 0 120 60">
              <polyline
                className="heartbeat-line"
                points="0,30 20,30 25,10 30,50 35,20 40,30 120,30"
              />
            </svg>
          </div>
        </div>

        <Image
          src="/login.png"
          alt="Authentication Hero"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
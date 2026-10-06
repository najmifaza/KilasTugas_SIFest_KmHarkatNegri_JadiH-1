import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { Calendar, Smartphone, Monitor } from "lucide-react";
import { MobileDeviceMockup } from "../components/MobileDeviceMockup";
import { FloatingBadge } from "../components/FloatingBadge";
import { theme } from "../theme";

export const RealDemo_03_MobileCockpitAndSync: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mobile device slide-in animation
  const mobileSlideSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  const mobileTranslateX = interpolate(mobileSlideSpring, [0, 1], [400, 0]);
  const mobileOpacity = interpolate(mobileSlideSpring, [0, 1], [0, 1]);

  // Desktop view tilt
  const desktopTiltSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 16 },
  });
  const desktopRotateY = interpolate(desktopTiltSpring, [0, 1], [0, -6]);
  const desktopScale = interpolate(desktopTiltSpring, [0, 1], [1, 0.92]);

  return (
    <div
      className="w-full h-full flex items-center justify-center p-8 relative overflow-hidden"
      style={{
        backgroundColor: theme.colors.bgWarm,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />

      {/* Main Container: Split View Desktop & Mobile */}
      <div className="w-full max-w-[1720px] h-[920px] flex items-center justify-between gap-8 relative z-10">
        {/* Left: Real Desktop App (Tilted) */}
        <div
          className="flex-1 h-full flex items-center justify-center transition-transform"
          style={{
            transform: `perspective(1400px) rotateY(${desktopRotateY}deg) scale(${desktopScale})`,
            transformOrigin: "center left",
          }}
        >
          <div className="w-full h-full rounded-2xl bg-white border border-slate-300 shadow-2xl overflow-hidden flex flex-col relative">
            {/* Browser top header */}
            <div className="h-10 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 bg-white px-3 py-0.5 rounded border border-slate-200">
                <Monitor className="w-3 h-3 text-slate-500" />
                <span>kilastugas.vercel.app (Desktop)</span>
              </div>
              <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Calendar &amp; Sync
              </div>
            </div>

            {/* Desktop Screen Content */}
            <div className="flex-1 relative overflow-hidden bg-[#fcece3]">
              <Img
                src={staticFile("real_captures/06_progress_updated.png")}
                className="w-full h-full object-cover object-top"
                alt="Desktop Cockpit"
              />

              {/* Callout on Desktop */}
              <FloatingBadge
                x={45}
                y={82}
                delay={10}
                icon={<Calendar className="w-4 h-4 text-blue-600" />}
                title="Integrasi Kalender Digital"
                subtitle="Google Calendar Direct Intent &amp; Unduh Berkas .ics RFC 5545"
                themeColor="blue"
              />
            </div>
          </div>
        </div>

        {/* Right: Real Mobile App (Sliding In) */}
        <div
          style={{
            transform: `translateX(${mobileTranslateX}px)`,
            opacity: mobileOpacity,
          }}
          className="shrink-0 flex items-center justify-center relative"
        >
          <MobileDeviceMockup
          imageSrc="real_captures/08_mobile_cockpit.png"
            tiltAngle={-4}
          />

          {/* Callout on Mobile */}
          <FloatingBadge
            x={50}
            y={24}
            delay={35}
            icon={<Smartphone className="w-4 h-4 text-emerald-600" />}
            title="Mobile Edge-to-Edge"
            subtitle="Responsif cepat di layar smartphone mahasiswa"
            themeColor="emerald"
          />
        </div>
      </div>
    </div>
  );
};

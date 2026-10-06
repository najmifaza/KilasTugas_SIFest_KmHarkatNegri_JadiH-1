import React from "react";
import { Img, staticFile } from "remotion";

import { theme } from "../theme";

interface MobileDeviceMockupProps {
  imageSrc: string;
  className?: string;
  tiltAngle?: number;
}

export const MobileDeviceMockup: React.FC<MobileDeviceMockupProps> = ({
  imageSrc,
  className = "",
  tiltAngle = 0,
}) => {
  return (
    <div
      className={`relative w-[360px] h-[740px] rounded-[52px] bg-slate-900 p-3.5 shadow-2xl border-4 border-slate-700/80 ${className}`}
      style={{
        transform: `perspective(1000px) rotateY(${tiltAngle}deg)`,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Screen Frame with Dynamic Island */}
      <div className="w-full h-full rounded-[42px] bg-[#fcece3] overflow-hidden relative flex flex-col border border-black/20">
        {/* Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full flex items-center justify-end px-3 z-50">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
        </div>

        {/* Real Mobile App Screen */}
        <div className="w-full h-full overflow-hidden relative">
          <Img
            src={staticFile(imageSrc)}
            className="w-full h-full object-cover object-top"
            alt="Real Mobile App"
          />
        </div>
      </div>
    </div>
  );
};

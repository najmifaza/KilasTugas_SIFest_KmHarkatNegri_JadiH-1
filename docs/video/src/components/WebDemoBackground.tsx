import React from "react";
import { staticFile, useCurrentFrame, interpolate } from "remotion";

export const WebDemoBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Word-by-word synchronized native 9:16 mobile app screens matching spoken transcript:
  let activeImage = "real_captures/01_dashboard_initial.png";
  let objectPosition = "center top";

  if (frame >= 4950) {
    // 02:45 - 03:06: 100% Progress / mobile responsive cockpit
    activeImage = "real_captures/08_mobile_cockpit.png";
    objectPosition = "center 15%";
  } else if (frame >= 4110) {
    // 02:17 - 02:44: Calendar export & Blueprint share
    activeImage = "real_captures/04_dashboard_with_tasks.png";
    objectPosition = "center 22%";
  } else if (frame >= 2340) {
    // 01:18 - 02:16: 25 min Pomodoro timer running
    activeImage = "real_captures/07_timer_running.png";
    objectPosition = "center 40%";
  } else if (frame >= 2070) {
    // 01:09 - 01:17: Grafik lingkaran Today's Progress menghitung akumulasi capaian
    activeImage = "real_captures/08_mobile_cockpit.png";
    objectPosition = "center top";
  } else if (frame >= 1680) {
    // 00:56 - 01:09: Checkbox clicked, ding sound, progress updated (1/6 17%)
    activeImage = "real_captures/06_progress_updated.png";
    objectPosition = "center 24%";
  } else if (frame >= 1350) {
    // 00:45 - 00:56: Subtask list expanded (langkah apa yang harus dikerjakan hari ini)
    activeImage = "real_captures/05_subtask_list.png";
    objectPosition = "center 24%";
  } else if (frame >= 1050) {
    // 00:35 - 00:45: Klik Pecah Tugas, label Tepat Waktu (On Track)
    activeImage = "real_captures/04_dashboard_with_tasks.png";
    objectPosition = "center 22%";
  } else if (frame >= 630) {
    // 00:21 - 00:35: Tempel instruksi tugas dari modul, bagi 5 tugas
    activeImage = "real_captures/03_modal_filled.png";
    objectPosition = "center 32%";
  } else if (frame >= 450) {
    // 00:15 - 00:21: Input judul tugas, tenggat waktu, kategori
    activeImage = "real_captures/02_modal_open.png";
    objectPosition = "center 28%";
  } else {
    // 00:00 - 00:15: Fresh mobile dashboard, guest mode, + Tambah Tugas
    activeImage = "real_captures/01_dashboard_initial.png";
    objectPosition = "center top";
  }

  // Smooth subtle micro-drift for polished camera feel
  const scale = interpolate(frame % 300, [0, 300], [1, 1.018], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        backgroundColor: "#09090b",
        overflow: "hidden",
      }}
    >
      <img
        src={staticFile(activeImage)}
        alt="Web Demo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${scale})`,
          filter: "brightness(0.96) contrast(1.04)",
        }}
      />

      {/* Subtle top & bottom shadow gradient so header and subtitles are crystal clear */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(9,9,11,0.58) 0%, rgba(9,9,11,0) 15%, rgba(9,9,11,0) 75%, rgba(9,9,11,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

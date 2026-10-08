import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { WebDemoBackground } from "../components/WebDemoBackground";
import { PresenterCutout } from "../components/PresenterCutout";
import { TopDynamicBar } from "../components/TopDynamicBar";
import { KineticCaptions } from "../components/KineticCaptions";
import { RoadmapOverlay } from "../components/RoadmapOverlay";
import { OutroOverlay } from "../components/OutroOverlay";

const CHAPTER_TRANSITIONS = [448, 1198, 2338, 4108, 4948, 5608, 6928];

export const VerticalVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#09090b",
        overflow: "hidden",
      }}
    >
      {/* 1. Real Web Application Screen Demo (Zoomed & Large UI Text) */}
      <WebDemoBackground />

      {/* 2. Voice Over Presenter Video di Ujung Atas */}
      <PresenterCutout />

      {/* 3. Soft Ambient Background Music */}
      <Audio
        name="Ambient BGM"
        src={staticFile("audio/bgm.wav")}
        volume={0.12}
      />

      {/* Chapter Transition Whooshes */}
      {CHAPTER_TRANSITIONS.map((transFrame) => (
        <Sequence key={transFrame} from={transFrame} durationInFrames={20}>
          <Audio src={staticFile("audio/whoosh.wav")} volume={0.3} />
        </Sequence>
      ))}

      {/* 4. Top Floating Status & Chapter Progress Island */}
      <TopDynamicBar />

      {/* 5. Clean, Large, Legible Subtitles */}
      <KineticCaptions />

      {/* 6. Section 7 Grand Final Roadmap Overlay */}
      <RoadmapOverlay layout="vertical" />

      {/* 7. Section 8 Official Outro & Platform Link Card */}
      <OutroOverlay layout="vertical" />
    </AbsoluteFill>
  );
};

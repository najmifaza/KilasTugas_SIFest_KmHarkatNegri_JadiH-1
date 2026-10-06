import React from "react";
import { Series } from "remotion";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_Problem } from "./scenes/Scene2_Problem";
import { Scene3_SolutionPillars } from "./scenes/Scene3_SolutionPillars";
import { Scene4_WalkthroughInput } from "./scenes/Scene4_WalkthroughInput";
import { Scene5_FocusAndPacing } from "./scenes/Scene5_FocusAndPacing";
import { Scene6_SharingAndCalendar } from "./scenes/Scene6_SharingAndCalendar";
import { Scene7_Architecture } from "./scenes/Scene7_Architecture";
import { Scene8_RoadmapClosing } from "./scenes/Scene8_RoadmapClosing";

export const MainVideo: React.FC = () => {
  return (
    <Series>
      {/* Scene 1: Title & Hook (6 seconds) */}
      <Series.Sequence durationInFrames={180}>
        <Scene1_Intro />
      </Series.Sequence>

      {/* Scene 2: Problem & Empirical Validation (8 seconds) */}
      <Series.Sequence durationInFrames={240}>
        <Scene2_Problem />
      </Series.Sequence>

      {/* Scene 3: Solution Philosophy & 4 Pillars (8 seconds) */}
      <Series.Sequence durationInFrames={240}>
        <Scene3_SolutionPillars />
      </Series.Sequence>

      {/* Scene 4: Walkthrough 1 - Input & AI Breakdown (12 seconds) */}
      <Series.Sequence durationInFrames={360}>
        <Scene4_WalkthroughInput />
      </Series.Sequence>

      {/* Scene 5: Walkthrough 2 - Micro-Pacing & Focus Timer (12 seconds) */}
      <Series.Sequence durationInFrames={360}>
        <Scene5_FocusAndPacing />
      </Series.Sequence>

      {/* Scene 6: Walkthrough 3 - Calendar & Blueprint Sharing (10 seconds) */}
      <Series.Sequence durationInFrames={300}>
        <Scene6_SharingAndCalendar />
      </Series.Sequence>

      {/* Scene 7: Technical Architecture & Zero-Downtime (9 seconds) */}
      <Series.Sequence durationInFrames={270}>
        <Scene7_Architecture />
      </Series.Sequence>

      {/* Scene 8: Roadmap & Closing (8 seconds) */}
      <Series.Sequence durationInFrames={240}>
        <Scene8_RoadmapClosing />
      </Series.Sequence>
    </Series>
  );
};

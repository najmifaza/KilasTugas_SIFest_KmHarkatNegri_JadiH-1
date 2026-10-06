import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { MainVideo } from "./MainVideo";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_Problem } from "./scenes/Scene2_Problem";
import { Scene3_SolutionPillars } from "./scenes/Scene3_SolutionPillars";
import { Scene4_WalkthroughInput } from "./scenes/Scene4_WalkthroughInput";
import { Scene5_FocusAndPacing } from "./scenes/Scene5_FocusAndPacing";
import { Scene6_SharingAndCalendar } from "./scenes/Scene6_SharingAndCalendar";
import { Scene7_Architecture } from "./scenes/Scene7_Architecture";
import { Scene8_RoadmapClosing } from "./scenes/Scene8_RoadmapClosing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master Video Demo Composition */}
      <Composition
        id="TimKilasTugas-KilasTugas-VideoDemo"
        component={MainVideo}
        durationInFrames={2190} // ~73 seconds @ 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Scene Compositions for Studio Editing */}
      <Folder name="Scenes">
        <Composition
          id="Scene1-Intro"
          component={Scene1_Intro}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene2-Problem"
          component={Scene2_Problem}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene3-SolutionPillars"
          component={Scene3_SolutionPillars}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene4-WalkthroughInput"
          component={Scene4_WalkthroughInput}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene5-FocusAndPacing"
          component={Scene5_FocusAndPacing}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene6-SharingAndCalendar"
          component={Scene6_SharingAndCalendar}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene7-Architecture"
          component={Scene7_Architecture}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene8-RoadmapClosing"
          component={Scene8_RoadmapClosing}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};

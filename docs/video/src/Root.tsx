import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { MainVideo } from "./MainVideo";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_Problem } from "./scenes/Scene2_Problem";
import { Scene3_SolutionPillars } from "./scenes/Scene3_SolutionPillars";
import { RealDemo_01_InputAndBreakdown } from "./scenes/RealDemo_01_InputAndBreakdown";
import { RealDemo_02_FocusAndPacing } from "./scenes/RealDemo_02_FocusAndPacing";
import { RealDemo_03_MobileCockpitAndSync } from "./scenes/RealDemo_03_MobileCockpitAndSync";
import { Scene7_Architecture } from "./scenes/Scene7_Architecture";
import { Scene8_RoadmapClosing } from "./scenes/Scene8_RoadmapClosing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master Video Demo Composition */}
      <Composition
        id="TimKilasTugas-KilasTugas-VideoDemo"
        component={MainVideo}
        durationInFrames={1890} // 63 seconds @ 30fps (exact scene sum)
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Scene Compositions for Studio Editing */}
      <Folder name="Scenes">
        <Composition
          id="01-Intro"
          component={Scene1_Intro}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="02-Problem"
          component={Scene2_Problem}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="03-SolutionPillars"
          component={Scene3_SolutionPillars}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="04-RealDemo-Breakdown"
          component={RealDemo_01_InputAndBreakdown}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="05-RealDemo-Focus"
          component={RealDemo_02_FocusAndPacing}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="06-RealDemo-MobileSync"
          component={RealDemo_03_MobileCockpitAndSync}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="07-Architecture"
          component={Scene7_Architecture}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="08-RoadmapClosing"
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

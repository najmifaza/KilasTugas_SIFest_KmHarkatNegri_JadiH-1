import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TimKilasTugas-KilasTugas-VideoDemo"
      component={MainVideo}
      durationInFrames={7354}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

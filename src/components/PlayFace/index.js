import React, { useState } from "react";
import cn from "classnames";

import { useInterval } from "hooks";
import talkingImg from "./images/talking.png";
import notTalkingImg from "./images/not_talking.png";

const FaceImg = ({ talking, ...props }) => (
  <img
    src={talking ? talkingImg : notTalkingImg}
    alt="talking_face"
    width="268"
    height="221"
    {...props}
  />
);

const Animation = () => {
  const [talking, setTalking] = useState(true);
  useInterval(() => {
    setTalking(!talking);
  }, 200);
  return <FaceImg talking={talking} />;
};

const PlayFace = ({ isPlaying, onFaceClick, enabled }) => {
  if (isPlaying) {
    return <Animation />;
  }

  return (
    <div className={cn("playface", { enabled })}>
      <FaceImg talking={false} onClick={enabled ? onFaceClick : undefined} />
    </div>
  );
};

export default PlayFace;

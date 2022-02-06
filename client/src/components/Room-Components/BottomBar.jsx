import React from "react";
import styled from "styled-components";
import Videocam from "../../assets/videocam.svg";
import Mic from "../../assets/mic.svg";
import Screen from "../../assets/desktop.svg";
import Chat from "../../assets/chat.svg";
import MicOff from "../../assets/micoff.svg";
import Videooff from "../../assets/videooff.svg";
import HangUp from "../../assets/phonedisabled.svg";

const BottomBar = ({
  isOpen,
  setisOpen,
  hang,
  onShare,
  toggleMicVideo,
  userMedia,
}) => {
  let isVideoOn = userMedia["localUser"].video;
  let isAudioOn = userMedia["localUser"].audio;
  return (
    <BBar>
      {isVideoOn ? (
        <IconButton onClick={toggleMicVideo} data-switch="video">
          <img src={Videocam} alt="videobtn" data-switch="video" />
        </IconButton>
      ) : (
        <IconButton onClick={toggleMicVideo} data-switch="video" danger>
          <img src={Videooff} alt="videobtn" data-switch="video" />
        </IconButton>
      )}
      {isAudioOn ? (
        <IconButton onClick={toggleMicVideo} data-switch="audio">
          <img src={Mic} alt="audiobtn" data-switch="audio" />
        </IconButton>
      ) : (
        <IconButton onClick={toggleMicVideo} data-switch="audio" danger>
          <img src={MicOff} alt="audiobtn" data-switch="audio" />
        </IconButton>
      )}
      <IconButton onClick={onShare}>
        <img src={Screen} alt="videobtn" />
      </IconButton>
      <SideOpener
        onClick={() => {
          setisOpen(!isOpen);
        }}
      >
        <img src={Chat} alt="videobtn" />
      </SideOpener>
      <IconButton onClick={hang} danger>
        <img src={HangUp} alt="disabledphone" />
      </IconButton>
    </BBar>
  );
};

export default BottomBar;

const BBar = styled.div`
display:flex;
align-items: center;
justify-content: center;
width: 98%;
margin-top: 20px;
`;
const IconButton = styled.button`
  padding: 12px;
  
  margin-left:${(props)=>(props.danger ? "auto" : "0")}
  // margin:auto;
  display: block;
  color: #fff;
  border: none;
  background-color: ${(props) => (props.danger ? "red" : "#ff3377")};
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
  transition: 0.5s all;
`;

const SideOpener = styled.button`
display: block;
opacity: 1;
padding: 10px;
color: #fff;
border: none;
background-color: #ff3377;
color: #fff;
border-radius: 5px;
cursor: pointer;
margin-right:5px;
`;

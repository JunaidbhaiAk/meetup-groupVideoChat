import React from "react";
import styled from "styled-components";
import Video from "./Video";
import Mic from "../../assets/mic.svg";
import VideoCam from "../../assets/videocam.svg";
import MicOff from '../../assets/micoff.svg';
import VideoCamoff from '../../assets/videooff.svg'
const UserVideos = ({ peers, usersMedia, myStream}) => {

  
  // const vid = userMedia['localUser'].video
  return (
    <VideoContainer>
      {peers &&
        peers.map((peer, idx) => {
          return (
            <Image2 key={idx}>
              <Video
                peer={peer}
                key={peer.peerId}
                userV={usersMedia}
                myStr={myStream}
              />
              <InfoCard>
                {usersMedia[peer.userName]?.audio ? <img src={Mic} alt="mic" style={{ padding: "2px" }} /> : <img src={MicOff} alt="mic" style={{ padding: "2px" }} />}
                <Name>{peer.userName}</Name>
                {usersMedia[peer.userName]?.video ? <img src={VideoCam} alt="video" style={{ padding: "2px" }} /> : <img src={VideoCamoff} alt="video" style={{ padding: "2px" }} />}
              </InfoCard>
            </Image2>
          );
        })}
    </VideoContainer>
  );
};

export default UserVideos;

const VideoContainer = styled.div`
  display: grid;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  grid-gap: 5px;

  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  width: 98%;
  max-height: 45%;
  overflow-y: auto;

  // @media (max-width:780px){
  //   grid-template-columns: 240px 240px;
  // }

  // @media (max-width:500px){
  //   grid-template-columns: 300px;
  // }
`;

const Image2 = styled.div`
  max-width: 500px;
`;

const InfoCard = styled.div`
  display: flex;
  width: 100%;
  background-color: #ff3377;
  align-items: center;
  justify-content: space-between;
  border-bottom-right-radius: 5px;
  margin-top: -7px;
  border-bottom-left-radius: 5px;
`;

const Name = styled.span`
  font-size: 0.8rem;
  color: #fff;
`;

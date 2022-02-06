import React, { useEffect, useRef } from "react";
import FitScreen from "../../assets/fitscreen.svg";
import styled from "styled-components";
const Video = (props) => {
  let tempStream;
  const peer = props.peer;

  const ref = useRef(null);
  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
      ref.current.srcObject.name = peer.userName;
    });
  }, [peer, props.isVideo]);

  const changeStream = () => {
    tempStream = props.myStr.current.srcObject;
    props.myStr.current.srcObject = ref.current.srcObject;
    ref.current.srcObject = tempStream;
  };
  return (
    <Div>
      <Btnx src={FitScreen} onClick={changeStream}></Btnx>
      <video ref={ref} autoPlay style={{ width: "100%", height: "100%",borderTopLeftRadius:"15px",borderTopRightRadius:"15px" }} />
    </Div>
  );
};

export default Video;

const Btnx = styled.img`
  position: absolute;
  z-index: 999;
  width: 30px;
  padding: 3px;
  color: #fff;
  opacity: 0;
  transition: 0.5s ease;
`;

const Div = styled.div`
  &:hover ${Btnx} {
    opacity: 1;
  }
`;

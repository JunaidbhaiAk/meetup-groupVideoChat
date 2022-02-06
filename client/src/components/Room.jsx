import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import styled from "styled-components";
import BottomBar from "./Room-Components/BottomBar";
import ChatFooter from "./Room-Components/ChatFooter";
import MessagesContainer from "./Room-Components/MessagesContainer";
import UserVideos from "./Room-Components/UserVideos";
import socket from "../socket/socket";
import { createPeer, addPeer } from "../utils/peerjs";
import { useParams } from "react-router-dom";
const Room = () => {
  const { roomId } = useParams(); //roomid getting from params
  const peerRef = useRef([]); //peerRef for destroying or adding peers
  const myStream = useRef(); //myStream;
  const myName = sessionStorage.getItem("user"); //name from session
  const [peers, setPeers] = useState([]); //all peers connection with clients
  const [msg, setMsg] = useState(""); // for setting usertyped message
  const [allmsg, setAllMsg] = useState([]); //All messages of specific room
  // const isResponsive = useMediaQuery({ query: "(max-width: 1100px)" }); //for making responsive
  const drawerRef = useRef(null); //ref for chatbox to set its class
  const [open, setopen] = useState(false); //for chatbox when responsive
  const [isScreenSharing, setisScreenSharing] = useState(false); //to know screenshare is active or not
  const screenTrackRef = useRef(null); // screenShare tracking
  const oldStream = useRef(null); //cloned stream
  const [userMedia, setuserMedia] = useState({
    localUser: { video: true, audio: true }, //my video audio
  });
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        //storing a copy of stream for screenshar process or Chaing Stream
        oldStream.current = stream;
        oldStream.current.name = myName;
        myStream.current.srcObject = stream;
        myStream.current.srcObject.name = myName;

        //Process for joining room to get all user id for making peer connections with each other
        socket.emit("joningRoom", { roomId, myName });

        //when i wiil join room i will create peer connection with all clients which are present in our room;
        socket.on("userjoinedRoom", (data) => {
          const peers = [];
          data.forEach(({ userId, info }) => {
            const { userName, video, audio } = info;
            if (userName !== myName) {
              //create a call for specific user using creatPeer util
              const peer = createPeer(userId, socket.id, stream);
              peer.userName = userName;
              peer.peerId = userId;
              peerRef.current.push({ peerId: userId, peer, userName });
              peers.push(peer);
              setuserMedia((pre) => {
                return { ...pre, [userName]: { video, audio } };
              });
            }
          });
          setPeers(peers);
        });

        //when i recive a call
        socket.on("reciveCall", ({ signal, from, info }) => {
          const { userName, video, audio } = info;
          const peerIdx = findPeer(from);
          if (!peerIdx) {
            //if it is not avilable in our connection add it to our peers using addPeer utils function
            const peer = addPeer(signal, from, stream);
            peer.userName = userName;
            peer.peerId = from;
            peerRef.current.push({ peerId: from, peer, userName });
            setPeers((pre) => {
              return [...pre, peer];
            });
            setuserMedia((pre) => {
              return { ...pre, [userName]: { video, audio } };
            });
          }
        });

        //a client has accepted my call

        socket.on("callAccepted", ({ signal, answerId, userName }) => {
          toast(`${userName} has joined the room`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });
      });

    //when i send message it will recived by clients that's in myRoom these will done by 'reciveMessage' event
    socket.on("reciveMessage", ({ name, message }) => {
      setAllMsg((pre) => {
        return [...pre, { sendedBy: name, message }];
      });
    });

    //when i leave call i have to tell all users who have joined the room so 'leaveCall event will do that thing'
    socket.on("leaveCall", ({ userId, name }) => {

      //notify users that user have left the room
      toast.warn(`${name} has left the room`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      if (myStream.current.srcObject.name === name) {
        myStream.current.srcObject = oldStream.current;
      }
      const peerIdx = findPeer(userId);
      peerIdx.peer.destroy();
      setPeers((users) => {
        users = users.filter((user) => user.peerId !== peerIdx.peer.peerId);
        return [...users];
      });
      peerRef.current = peerRef.current.filter(
        ({ peerId }) => peerId !== userId
      );
    });

    //clients listen when i muted my mic or audio
    socket.on("switched", ({ userName, target }) => {
      console.log(target);
      setuserMedia((pre) => {
        let video = pre[userName].video;
        let audio = pre[userName].audio;
        if (target === 'video') video = !video;
        else audio = !audio;
        return { ...pre, [userName]: { video, audio } };
      });
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [myStream]);

  //useEffect fot message box

  useEffect(() => {
      open
        ? (drawerRef.current.style.transform = "translateX(0px)")
        : (drawerRef.current.style.transform = "translateX(-335px)");
  }, [open]);

  //util function to find peers
  const findPeer = (userId) => {
    return peerRef.current.find((p) => p.peerId === userId);
  };

  //mute audio or Video
  const toggleMicVideo = (e) => {
    const target = e.target.getAttribute("data-switch");
    setuserMedia((pre) => {
      let videoSwitch = pre["localUser"].video;
      let audioSwitch = pre["localUser"].audio;
      if (target === "video") {
        const userVideoTrack = myStream.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const useraudioTrack = myStream.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;
        useraudioTrack.enabled = audioSwitch;
      }
      return { ...pre, localUser: { video: videoSwitch, audio: audioSwitch } };
    });

    socket.emit("switchVideoAudio", { roomId, target });
  };

  //for hangup
  const hangUp = (e) => {
    e.preventDefault();
    //tell clients that i am leaving room;
    socket.emit("leaveRoom", { roomId });
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  //for sending Message

  const SendMsg = (e) => {
    if (e.keyCode === 13) {
      socket.emit("sendMessage", { name: myName, message: msg, roomId });
      setAllMsg((pre) => {
        return [...pre, { sendedBy: myName, message: msg }];
      });
      setMsg("");
    }
  };

  //screen sharing

  const shareScreen = () => {
    if (!isScreenSharing) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: "true" })
        .then((stream) => {
          const screenTrack = stream.getTracks()[0];
          peerRef.current.forEach(({ peer }) => {
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === "video"),
              screenTrack,
              oldStream.current
            );
          });

          screenTrack.onended = () => {
            peerRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === "video"),
                oldStream.current
              );
            });
            myStream.current.srcObject = oldStream.current;
            setisScreenSharing(false);
          };
          myStream.current.srcObject = stream;
          screenTrackRef.current = screenTrack;
          setisScreenSharing(true);
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  return (
    <Div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container>
      <RightContainer ref={drawerRef}>
          <ChatContainer>
            {/* All Messages */}

            <MessagesContainer allmsg={allmsg} />

            {/* MessageFooter */}
            <ChatFooter setMsg={setMsg} msg={msg} SendMsg={SendMsg} />
          </ChatContainer>
        </RightContainer>
        <LeftContainer>
          <Image1>
            <video
              ref={myStream}
              style={{ width: "100%", height: "100%",borderRadius:"15px" }}
              autoPlay
              muted
            />
          </Image1>
          {/* For users Videos */}
          <UserVideos
            // userMedia={userMedia}
            peers={peers}
            usersMedia={userMedia}
            myStream={myStream}
            oldStream={oldStream}
          />
          {/* BottomBar tools */}
          <BottomBar
            isOpen={open}
            setisOpen={setopen}
            hang={hangUp}
            onShare={shareScreen}
            toggleMicVideo={toggleMicVideo}
            userMedia={userMedia}
          />
        </LeftContainer>

        
      </Container>
    </Div>
  );
};

export default Room;

const Div = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  background-color:#323232;
  padding: 25px 15px;
  // margin: auto;
  position:fixed;
  height:100%;
  width:100%;
  justify-content:space-evenly;

  @media (max-width: 700px) {
    padding: 5px;
  }
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items:flex-start; 
  width:100%;
`;

const Image1 = styled.div`
width: 98%;
height: 400px;

`;

const RightContainer = styled.div`
  justify-content: space-between;
  transition: 0.5s all;
  transform: none;
  position: fixed;
  width:100%;
  z-index:999;
  transform: translateX(-356px);
`;
const ChatContainer = styled.div`
  padding: 10px;
  border-radius: 8px;
  width: 300px;
  height: 85%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: #ff3377;
`;

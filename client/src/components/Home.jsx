import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import Hero from "./Home-Components/Hero";
import Navbar from "./Home-Components/Navbar";

const Home = () => {
  //for navigation
  const navigate = useNavigate();
  const Id = useRef();
  const Name = useRef();

  //Results of UserExsist from socket.io
  useEffect(() => {
    socket.on("userExsist", ({ error }) => {
      if (error) {
        alert("user exsist");
        return;
      } else {
        const roomId = Id.current.value;
        const name = Name.current.value;
        sessionStorage.setItem("user", name);
        navigate(`${roomId}`);
      }
    });
    // eslint-disable-next-line
  }, []);

  const checkRoom = () => {
    const roomId = Id.current.value;
    const userName = Name.current.value;
    if (roomId === "" || userName === "") {
      alert("enter fields");
      return;
    }
    //check if same username is already exsist in Room or not
    socket.emit("checkUserExsist", { roomId, userName });
  };

  return (
    <div>
      <Navbar />
      <Hero textref={Name} roomref={Id} check={checkRoom} />
    </div>
  );
};

export default Home;

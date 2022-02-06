import React from "react";
import styled from "styled-components";
import img from "../../assets/heroimage.svg";

const Hero = ({ textref, roomref, check }) => {
  return (
    <Section>
      <Container>
        <LeftContainer>
          <Subtitle>Simple Communication Tool</Subtitle>
          <Title>Engage Your Friends in Minutes.</Title>
          <Text>Start gossip now</Text>
          <Form>
            <Input placeholder="Enter Username" ref={textref} />
            <Input placeholder="Enter Roomname" ref={roomref} />
            <Button onClick={check}>Join Room</Button>
          </Form>
        </LeftContainer>
        <RightImage src={img} />
      </Container>
    </Section>
  );
};

export default Hero;

const Section = styled.div`
height: 80vh;
display: flex;
align-items: center;
justify-content: center;

`;

const Container = styled.div`
  display: flex;
  
  @media (max-width:900px){
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 80vh;
    align-items: center;
    text-align:center;
  }
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
`;
const Subtitle = styled.h3`
  
  font-size: 1.5vw;
  color: #223344;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;

  @media (max-width:900px){
    font-size:1.5vh;
    margin:auto;
    text-align:center;
  }
`;
const Title = styled.h1`
  font-size: 4.5vw;
  font-weight: bold;
  color: #223344;
  width: 45vw;
  margin-bottom: 15px;
  margin-top: 0;
  
  @media (max-width:900px){
    font-size: 4vh;
    width: 400px;
    margin:auto;
  }
`;

const Text = styled.p`
  font-size: 1.5vw;
  margin-top: 0;
  marin-bottom: 15px;
  letter-spacing: 2px;
  opacity: 80%;

  @media (max-width:900px){
    font-size:1.5vh;
    margin:auto;
  }
  
`;

const Form = styled.div`
  display: flex;
  margin-top: 10px;
  @media (max-width:900px){
    display: flex;
    flex-direction: column;
    align-items: center;
    width:100%;
  }
`;
const Input = styled.input`
  border: 1px solid #ff6699;
  border-radius: 30px;
  padding: 0.8vw 0.8vh;
  width: 14vw;
  margin-right: 20px;
  text-indent: 5px;
  ::placeholder {
    color: #616060;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  @media (max-width:900px){
    padding: 10px 15px;
    width: 250px;
    margin-top: 5px;
  }
`;

const Button = styled.button`
  padding: 1vh 2.5vw;
  border-radius: 5px;
  border: none;
  background-color: #ff3377;
  font-size: 1vw;
  color: #fff;
  font-weight: bold;
  cursor: pointer;

  @media (max-width:900px){
    padding: 10px 15px;
    font-size: 0.8rem;
    margin-top: 12px;
  }
`;

const RightImage = styled.img`
  width: 30vw;
  margin-left:1.5vw;
  @media (max-width:900px){
    width: 40vh;
  }
`;

import React from 'react';
import styled from 'styled-components';

const Message = ({name,message}) => {
  return(  
  <UserChat>
    <Name>{name}</Name>
    <MessageContainer><Text>{message}</Text></MessageContainer>
  </UserChat>);
};

export default Message;

const UserChat = styled.div`
display:flex;
flex-direction:column;
color:#fff;
padding-bottom:5px;
`
const MessageContainer = styled.div`
max-width:200px;
width:fit-content;
background-color:#fff;
border-radius:2px;
padding:5px 12px;
color:black;
`
const Name = styled.h3`
margin:0;
font-size:0.9rem;
margin-bottom:5px;
`
const Text = styled.p`
margin:0;
font-size:0.8rem;
`
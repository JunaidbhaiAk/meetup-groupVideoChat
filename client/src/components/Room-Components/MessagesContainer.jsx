import React from 'react';
import styled from 'styled-components';
import Message from './Message'
const MessagesContainer = ({allmsg}) => {
  return( 
  <Chats>
    {allmsg && allmsg.map((ele,idx)=>{
      return <Message name={ele.sendedBy} message={ele.message} key={idx}/>
    })}
  </Chats>);
};

export default MessagesContainer;

const Chats = styled.div`
display:flex;
flex-direction:column;
overflow-y:auto; 
max-height:356px;
`

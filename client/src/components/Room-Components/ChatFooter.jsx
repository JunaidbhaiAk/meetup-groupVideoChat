import React from 'react';
import Send from '../../assets/send.svg'
import styled from 'styled-components';
const ChatFooter = ({setMsg,msg,SendMsg}) => {
  return (
  <Footer>
    <Input onChange={e=>setMsg(e.target.value)} value={msg} onKeyUp={SendMsg}/>
    <img src={Send} alt="send" style={{position:"absolute",width:"15px",paddingRight:"8px"}} />
  </Footer>);
};

export default ChatFooter;

const Footer = styled.div`
display:flex;
align-items:center;
justify-content:end;

@media (max-width:1100px){
  margin-top:8px;
}
`


const Input = styled.input`
width:100%;
padding:5px 25px 5px 10px;
color:#fff;
border:2px solid #fff;
background-color:#ff3377;
border-radius:20px;

::placeholder{
  color:#fff;
}

&:focus{
  outline:none;
  box-shadow:none;
}
`
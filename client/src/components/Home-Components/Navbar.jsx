import React from "react";
import styled from "styled-components";
import Log from '../../assets/logo.svg'
const Navbar = () => {
  return (
    <div>
      <Nav>
        <Container>
          <Logo src={Log} />
          <Navigation>
            <List>Home</List>
            <List>About</List>
          </Navigation>
        </Container>
      </Nav>
    </div>
  );
};

export default Navbar;

const Nav = styled.div`
width:100%;
`

const Container = styled.div`
display:flex;
height:8vh;
padding-left:12vw;
padding-right:15vw;
align-items:center;
justify-content:space-between;

@media (max-width:900px){
  padding-left:5vw;
  padding-right:5vw;
}
`

const Logo = styled.img`
width:150px;
@media (max-width:900px){
  width:110px;
}
`

const Navigation = styled.ul`
list-style:none;
display:flex;
`

const List = styled.li`
font-size:15px;
cursor:pointer;
padding-right:25px;
color:#707070;

@media (max-width:900px){
  font-size:10px;
}
`

import React, { Component } from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import logoText from "./logo-text.svg";
import { STANDALONE } from "../mobile";

const Container = styled.header`
  display: ${STANDALONE ? "none" : "block"};
`;

const Logo = styled.img`
  margin-top: -8px;
  width: 110px;
  @media (max-width: 380px) {
    flex-shrink: 1;
    width: 80px;
  }
`;

const Description = styled.h1`
  margin: 0;
  line-height: 1.7em;
  color: #615f5f;
  font-size: 19px;
  text-align: center;
  font-weight: 600;
`;

const LogoWrapper = styled.div`
  display: flex;
  padding: 1em 2em;
  margin-top: 2em;
  margin-bottom: 2em;
  justify-content: center;
  @media (max-width: 500px) {
    padding: 0em 2em;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.img`
  align-self: center;
  width: 240px;
  @media (max-width: 380px) {
    width: 100%;
  }
`;

export class Header extends Component {
  render() {
    return (
      <Container>
        <LogoWrapper>
          <Logo src={logo} alt="logo" />
          <TitleWrapper>
            <Title src={logoText} alt="Onneter" />
            <Description>
              Arvo ihan mitä vain{" "}
              <span role="img" aria-label="tada emoji">
                🎉
              </span>
              <br />
            </Description>
          </TitleWrapper>
        </LogoWrapper>
      </Container>
    );
  }
}

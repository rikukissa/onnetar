import React, { Component } from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import logoText from "./logo-text.svg";
import { STANDALONE } from "../mobile";

const Container = styled.header`
  padding: 1em 2em;
  margin-top: 2em;
  margin-bottom: ${STANDALONE ? 0 : 2}em;
`;

const Logo = styled.img`
  margin-top: -8px;
  width: 110px;
  @media (max-width: 380px) {
    flex-shrink: 1;
    width: 80px;
  }
`;

const Title = styled.img`
  align-self: center;
  width: 240px;
  @media (max-width: 380px) {
    width: 100%;
  }
`;

const StandaloneHeader = styled.header`
  padding: 1em;
  padding-top: 4em;
  text-align: center;
  background: #fafafa;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 2em;
  flex-shrink: 0;
  ${Logo} {
    width: 50px;
    align-self: center;
  }
  ${Title} {
    width: 100px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Description = styled.h1`
  margin: 0;
  line-height: 1.7em;
  color: #615f5f;
  font-size: 19px;
  text-align: center;
  font-weight: 600;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export class Header extends Component {
  render() {
    if (STANDALONE) {
      return (
        <StandaloneHeader>
          <Logo src={logo} alt="logo" />
          <Title src={logoText} alt="Onneter" />
        </StandaloneHeader>
      );
    }

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

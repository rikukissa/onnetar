import React, { Component } from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import logoText from "./logo-text.svg";

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
  color: #a0a0a0;
  font-size: 19px;
  text-align: center;
  font-weight: 600;
  @media (max-width: 380px) {
    font-size: 14px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  padding: 1em;
  margin-top: 2em;
  margin-bottom: 2em;
  justify-content: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.img`
  width: 240px;
  @media (max-width: 380px) {
    width: 150px;
  }
`;

const SocialButtons = styled.div`
  text-align: center;
`;

export class Header extends Component {
  render() {
    return (
      <header>
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
            <SocialButtons>
              <div
                className="fb-share-button"
                data-href={document.location.href}
                data-layout="button"
                data-size="large"
                data-mobile-iframe="true"
              >
                <a
                  className="fb-xfbml-parse-ignore"
                  target="_blank noreferrer"
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fonnetar.fi%2F&amp;src=sdkpreparse"
                >
                  Jaa
                </a>
              </div>
            </SocialButtons>
          </TitleWrapper>
        </LogoWrapper>
      </header>
    );
  }
}

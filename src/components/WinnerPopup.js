import React, { Component } from "react";
import styled from "styled-components";
import { ShareButtons, generateShareIcon } from "react-share";

import loader from "./loader.svg";
import link from "./link.svg";

import { shorten } from "../service";
import CloseIcon from "./CloseIcon";

const { FacebookShareButton, TwitterShareButton } = ShareButtons;

const CloseModal = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  cursor: pointer;
`;

const WinnerPopupContainer = styled.div`
  position: fixed;
  width: 90%;
  top: 50%;
  left: 50%;
  padding: 0.5em;
  z-index: 3;
  border: 5px solid #ffb100;
  border-radius: 5px;
  background-color: #ffffff;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414zm16 0L90 80.414 95.586 86H84.414zm16 0L106 80.414 111.586 86h-11.172zm-8-6h11.173L98 85.586 92.414 80zM82 85.586L87.586 80H76.414L82 85.586zM17.414 0L.707 16.707 0 17.414V0h17.414zM4.28 0L0 12.838V0h4.28zm10.306 0L2.288 12.298 6.388 0h8.198zM180 17.414L162.586 0H180v17.414zM165.414 0l12.298 12.298L173.612 0h-8.198zM180 12.838L175.72 0H180v12.838zM0 163h16.413l.5.5 7.294 7.293L25.414 172l-8 8H0v-17zm0 10h6.613l-2.334 7H0v-7zm14.586 7l7-7H8.72l-2.333 7h8.2zM0 165.414L5.586 171H0v-5.586zM10.414 171L16 165.414 21.586 171H10.414zm-8-6h11.172L8 170.586 2.414 165zM180 163h-16.413l-7.794 7.793-1.207 1.207 8 8H180v-17zm-14.586 17l-7-7h12.865l2.333 7h-8.2zM180 173h-6.613l2.334 7H180v-7zm-21.586-2l5.586-5.586 5.586 5.586h-11.172zM180 165.414L174.414 171H180v-5.586zm-8 5.172l5.586-5.586h-11.172l5.586 5.586zM152.933 25.653l1.414 1.414-33.94 33.942-1.416-1.416 33.943-33.94zm1.414 127.28l-1.414 1.414-33.942-33.94 1.416-1.416 33.94 33.943zm-127.28 1.414l-1.414-1.414 33.94-33.942 1.416 1.416-33.943 33.94zm-1.414-127.28l1.414-1.414 33.942 33.94-1.416 1.416-33.94-33.943zM0 85c2.21 0 4 1.79 4 4s-1.79 4-4 4v-8zm180 0c-2.21 0-4 1.79-4 4s1.79 4 4 4v-8zM94 0c0 2.21-1.79 4-4 4s-4-1.79-4-4h8zm0 180c0-2.21-1.79-4-4-4s-4 1.79-4 4h8z' fill='%23eca417' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E");
  box-shadow: 20px 20px 0px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  transform: translateX(-50%) translateY(-50%);
`;

const WinnerPopupOpening = styled.div`
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
`;

const WinnerPopupOpen = styled.div`
  padding: 1em;
`;

const WinnerLabel = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: 19px;
  margin-top: 0.5em;
`;
const WinnerText = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: 55px;
  color: #ffb100;
`;

const FacebookIcon = generateShareIcon("facebook");
const TwitterIcon = generateShareIcon("twitter");

const FacebookShareButtonContent = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const FacebookShareButtonText = styled.div`
  height: 32px;
  margin-left: 0.5em;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #3b5998;
  font-weight: bold;
`;

const FacebookShareButtonContainer = styled(FacebookShareButton)`
  margin-right: 1em;
  margin-bottom: 0.5em;
`;

const TwitterShareButtonContainer = styled(TwitterShareButton)`
  margin-right: 1em;
  margin-bottom: 0.5em;
`;

const Social = styled.div`
  display: flex;
  margin-top: 1em;
  flex-wrap: wrap;
  justify-content: center;
`;

const UrlShareButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-bottom: 0.5em;
`;

const UrlIcon = styled.div`
  width: 31px;
  height: 31px;
  border-radius: 32px;
  background-color: #9143c1;
  background-image: url(${link});
  background-size: 55% 55%;
  background-position: center center;
  background-repeat: no-repeat;
`;

const UrlInput = styled.input`
  width: 160px;
  font: inherit;
  border: 2px solid #ffb100;
  padding: 0.5em;
  color: #00aced;
`;

export class WinnerPopup extends Component {
  state = {
    generatingUrl: false,
    generatingForTwitter: false,
    url: ""
  };

  twitterShareRef = React.createRef();
  generateShortUrl = (generatingForTwitter = false) => {
    if (this.state.url !== "" && generatingForTwitter) {
      return Promise.resolve();
    }

    this.setState(() => ({
      generatingUrl: true,
      url: "",
      generatingForTwitter
    }));

    const onShortUrlLoaded = ({ url }) =>
      new Promise((resolve, reject) =>
        this.setState(
          () => ({
            url,
            generatingUrl: false
          }),
          resolve
        )
      );

    const onShortUrlFailed = () =>
      new Promise((resolve, reject) =>
        this.setState(
          () => ({
            url: window.location.href,
            generatingUrl: false
          }),
          resolve
        )
      );

    return shorten(window.location.href)
      .then(onShortUrlLoaded)
      .catch(onShortUrlFailed);
  };
  shareInTwitter = event => {
    event.stopPropagation();
    this.generateShortUrl(true).then(() =>
      this.twitterShareRef.current.click()
    );
  };
  render() {
    return (
      <WinnerPopupContainer>
        <WinnerPopupOpening className="winner-popup-opening-content">
          <span>{this.props.winner.name}</span>
        </WinnerPopupOpening>
        <WinnerPopupOpen className="winner-popup-open-content">
          <WinnerLabel>Ja voittaja on:</WinnerLabel>
          <WinnerText>
            {this.props.winner.name}{" "}
            <span aria-label="tada emoji" role="img">
              🎉
            </span>
          </WinnerText>
          <Social>
            <FacebookShareButtonContainer
              url={window.location.href}
              quote={`Arpaonni suosi tällä kertaa osallistujaa ${
                this.props.winner.name
              } - Olet paras! Pidä tästä kiinni myös jatkossa.`}
            >
              <FacebookShareButtonContent>
                <FacebookIcon size={32} round />
                <FacebookShareButtonText>
                  Jaa tulos Facebookissa
                </FacebookShareButtonText>
              </FacebookShareButtonContent>
            </FacebookShareButtonContainer>

            <TwitterShareButtonContainer
              url={this.state.url || window.location.href}
              title={`${
                this.props.winner.name
              } - Olet paras! Pidä tästä kiinni myös jatkossa.`}
            >
              <div ref={this.twitterShareRef} />
              <FacebookShareButtonContent onClick={this.shareInTwitter}>
                {this.state.generatingUrl && this.state.generatingForTwitter ? (
                  <img src={loader} alt="Loading" />
                ) : (
                  <TwitterIcon size={32} round />
                )}
                <FacebookShareButtonText>
                  Jaa tulos Twitterissä
                </FacebookShareButtonText>
              </FacebookShareButtonContent>
            </TwitterShareButtonContainer>
            {this.state.url === "" || this.state.generatingForTwitter ? (
              <UrlShareButtonContainer onClick={() => this.generateShortUrl()}>
                {this.state.generatingUrl &&
                !this.state.generatingForTwitter ? (
                  <img src={loader} alt="Loading" />
                ) : (
                  <UrlIcon />
                )}
                <FacebookShareButtonText>Jaa linkki</FacebookShareButtonText>
              </UrlShareButtonContainer>
            ) : (
              <UrlInput readOnly value={this.state.url} />
            )}
          </Social>
          <CloseModal onClick={this.props.onCloseModal}>
            <CloseIcon />
          </CloseModal>
        </WinnerPopupOpen>
      </WinnerPopupContainer>
    );
  }
}

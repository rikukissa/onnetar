import React, { Component } from "react";
import queryString from "query-string";
import styled from "styled-components";
import Textarea from "react-textarea-autosize";
import Confetti from "react-dom-confetti";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { ShareButtons, generateShareIcon } from "react-share";
import { uniqBy } from "lodash-es";
import logo from "./logo.svg";
import chicken from "./chicken.svg";
import loader from "./loader.svg";
import link from "./link.svg";
import logoText from "./logo-text.svg";

import { shorten } from "./service";
import Guide from "./components/Guide";
import Fade from "./components/Fade";
import CloseIcon from "./components/CloseIcon";

import "./App.css";

const { FacebookShareButton, TwitterShareButton } = ShareButtons;

const MIN_SHUFFLES = 30;

const easeOutBy = power => t => 1 - Math.abs(Math.pow(t - 1, power));

const PLACEHOLDERS = [
  "pizza, kalakeitto, maksalaatikko...",
  "Lauri, Antti, Pasi, Miro, Riku...",
  "😂, 😎, 😬, 💩"
];

const confettiConfig = {
  spread: 60,
  startVelocity: 20,
  elementCount: 200,
  decay: 0.95
};

function createSeed(timeSeed) {
  return parseInt(timeSeed.toString().substr(-3), 10);
}

function writeToUrl(state) {
  const storedState = {
    s: state.seed,
    p: state.participants.map(({ name }) => name).join(",")
  };

  window.history.pushState(
    "page2",
    "Title",
    `/?${queryString.stringify(storedState)}`
  );
}

function getStoredState() {
  const urlParams = queryString.parse(window.location.search);

  return {
    seed: urlParams.s === undefined ? 0 : parseInt(urlParams.s, 10),
    participants: urlParams.p
      ? urlParams.p.split(",").map((name, id) => ({ name, id }))
      : []
  };
}

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleEasing(t) {
  return 1 - easeOutBy(10)(1 - t);
}

function splitToNames(str) {
  return str
    .split(/[,;\n\t]/gi)
    .map(name => name.trim())
    .filter(name => name !== "");
}

const AppContainer = styled.div`
  padding: 1em;
  transition: padding 1300ms;
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
  color: #a0a0a0;
  font-size: 19px;
  text-align: center;
  font-weight: 600;
  @media (max-width: 380px) {
    font-size: 14px;
  }
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
  font-weight: bold;
  color: #615f5f;
  font-size: 16px;
`;

const AddParticipantForm = styled.form``;

const Tip = styled.div`
  margin-top: 1em;
`;

const CloseModal = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  cursor: pointer;
`;

const AddParticipantWrapper = styled.div`
  display: flex;
`;

const AddParticipantButton = styled.button`
  border: 0;
  background: #9143c1;
  color: #fff;
  font: inherit;
  font-size: 18px;
  padding: 1em;
  cursor: pointer;
  font-weight: bold;
  border-radius: 0 3px 3px 0;
  margin-left: -3px;
`;

const AddParticipantInput = styled(Textarea)`
  font-family: inherit;
  font-size: 28px;
  padding: 0.75em;
  flex-grow: 1;
  border: 4px solid #9143c1;
  border-radius: 3px;
  &::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    opacity: 0.6;
  }
  &:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    opacity: 0.6;
  }
  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    opacity: 0.6;
  }
  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    opacity: 0.6;
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

const Content = styled.div`
  flex-grow: 1;
  max-width: 800px;
  margin: auto;
`;

const ConfettiContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
`;

const ShuffleButton = styled.button`
  width: 100%;
  cursor: pointer;
  border: 0;
  color: #fff;
  background: #2c9eff;
  background-image: url(${chicken});
  background-repeat: no-repeat;
  background-size: auto 60px;
  background-position: 10px center;
  padding: 1rem 80px;
  font: inherit;
  font-size: 40px;
  font-weight: 600;
  border-radius: 5px;
  text-align: center;
  z-index: 2;
  transition: transform 300ms;
  position: relative;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1);
`;

const ShuffleButtonContainer = styled.div`
  margin-top: 2em;
`;

const Participants = styled.div`
  display: ${({ fullSized }) => (fullSized ? "block" : "flex")};
  flex-wrap: wrap;
  margin-top: 2em;
  justify-content: center;
`;

const Lot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ highlighted }) => (highlighted ? "#ffb100" : "#65d065")};
  z-index: ${({ highlighted, winner }) => (highlighted || winner ? 1 : 0)};
  ${({ highlighted }) => (highlighted ? "transform: scale(1.1, 1.1)" : "")};
  transition: transform 200ms;
  margin: 1em ${({ fullSized }) => (fullSized ? 0 : "0.5em")};
  padding: 0.5em;
  font-weight: bold;
  color: #fff;
  font-size: 18px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  min-width: 4em;
  border-radius: 3px;
`;

const RemoveLot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  &:after {
    display: flex;
    justify-content: center;
    align-items: center;
    content: "Poista";
    border-radius: 3px;
    background: #f95353;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 100%;
    transition: left 300ms;
  }
  &:hover {
    &:after {
      left: 0;
    }
  }
`;

const RemoveLotIcon = styled(CloseIcon)`
  fill: #fff;
  position: absolute;
  right: 1em;
  width: 16px;
  height: 16px;
`;

const WinnerPopup = styled.div`
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

class App extends Component {
  state = {
    currentName: "",
    participants: [],
    currentlySelected: null,
    shuffling: false,
    popupStart: { top: 0, left: 0 },
    generatingUrl: false,
    generatingForTwitter: false,
    currentPlaceholder:
      PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)],
    seed: 0,
    url: "",
    ...getStoredState()
  };
  elements = {};
  twitterShareRef = React.createRef();
  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(({ currentPlaceholder }) => ({
        currentPlaceholder:
          PLACEHOLDERS[
            (PLACEHOLDERS.indexOf(currentPlaceholder) + 1) % PLACEHOLDERS.length
          ]
      }));
    }, 7000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  updateName = event => {
    const name = event.target.value;
    this.setState(() => ({
      currentName: name
    }));
  };
  participantsWithIds = names => {
    const participantsLength = this.state.participants.length;

    return names.map((name, i) => ({
      id: participantsLength + i,
      name
    }));
  };
  addParticipant = event => {
    event.preventDefault();
    const newParticipants = this.participantsWithIds(
      splitToNames(this.state.currentName)
    );
    this.setParticipants(this.state.participants.concat(newParticipants));
  };
  setParticipants = names => {
    this.setState(state => {
      const uniqueParticipants = uniqBy(names, "name");

      const newState = {
        ...state,
        participants: uniqueParticipants,
        currentName: "",
        url: ""
      };
      writeToUrl(newState);
      return newState;
    });

    if (this.state.shuffling) {
      this.cancelShuffle();
    }
  };
  cancelShuffle = () => {
    this.setState(() => ({
      winner: null,
      shuffling: false,
      currentlySelected: null
    }));
  };
  loop = () => {
    if (this.state.currentlySelected === this.state.targetIndex) {
      const winnerLotRect = this.elements[
        this.state.winner.id
      ].getBoundingClientRect();
      this.setState(() => ({
        shuffling: false,
        currentlySelected: null,
        popupStart: {
          top: winnerLotRect.top + winnerLotRect.height / 2,
          left: winnerLotRect.left + winnerLotRect.width / 2,
          width: winnerLotRect.width,
          height: winnerLotRect.height
        }
      }));
      return;
    }

    if (!this.state.shuffling) {
      return;
    }

    this.setState(
      ({ currentlySelected }) => ({
        currentlySelected:
          currentlySelected === null ? 0 : currentlySelected + 1
      }),
      () =>
        setTimeout(
          this.loop,
          Math.max(
            100,
            shuffleEasing(
              this.state.currentlySelected / this.state.targetIndex
            ) * 1000
          )
        )
    );
  };
  submitIfEnter = event => {
    if (!event.shiftKey && event.keyCode === 13) {
      this.addParticipant(event);
    }
  };
  setRef = (el, participant) => {
    this.elements[participant.id] = el;
  };
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
  shuffle = () => {
    const { shuffling, participants } = this.state;

    let allParticipants = participants;

    const pendingNames = splitToNames(this.state.currentName);

    if (pendingNames.length > 0) {
      allParticipants = allParticipants.concat(
        this.participantsWithIds(pendingNames)
      );
    }

    if (shuffling) {
      return;
    }

    const seed = this.state.seed || createSeed(Date.now());
    const winnerIndex = Math.floor(allParticipants.length * random(seed));
    const winner = allParticipants[winnerIndex];

    this.setState(state => {
      const newState = {
        ...state,
        shuffling: true,
        url: "",
        seed,
        participants: allParticipants,
        targetIndex:
          Math.floor(MIN_SHUFFLES / allParticipants.length) *
            allParticipants.length +
          winnerIndex,
        winner
      };

      writeToUrl(newState);

      return newState;
    }, this.loop);
  };
  removeParticipant = participant => {
    if (this.state.shuffling) {
      this.cancelShuffle();
    }
    this.setParticipants(
      this.state.participants.filter(p => p !== participant)
    );
  };
  closeModal = () => {
    this.setState(() => ({
      winner: null,
      seed: null
    }));
  };
  shareInTwitter = event => {
    event.stopPropagation();
    this.generateShortUrl(true).then(() =>
      this.twitterShareRef.current.click()
    );
  };
  render() {
    const cantAdd = this.state.currentName === "";
    const multipleParticipantsInTextInput =
      splitToNames(this.state.currentName).length > 1;

    const shuffleButtonVisible =
      !this.state.winner &&
      !this.state.shuffling &&
      (this.state.participants.length > 1 || multipleParticipantsInTextInput);

    const winnerModalOpen = !this.state.shuffling && this.state.winner;
    const fullSized = this.state.participants.length < 6;

    return (
      <AppContainer>
        <div>
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
        </div>
        <Content>
          <Guide />

          <AddParticipantForm onSubmit={this.addParticipant}>
            <Label>Lisää arvontaan osallistujat:</Label>

            <AddParticipantWrapper>
              <AddParticipantInput
                rows={1}
                placeholder={this.state.currentPlaceholder}
                onKeyDown={this.submitIfEnter}
                value={this.state.currentName}
                onChange={this.updateName}
                type="text"
              />
              {!cantAdd && (
                <AddParticipantButton>
                  Lisää
                  <br /> osallistujat
                </AddParticipantButton>
              )}
            </AddParticipantWrapper>
            <Tip>
              Voit lisätä osallistujat yksi kerrallaan tai usean yhdellä kertaa
              erottamalla nimet pilkulla, puolipisteellä tai rivinvaihdolla.
            </Tip>
          </AddParticipantForm>
          <ConfettiContainer>
            <Confetti active={winnerModalOpen} config={{ ...confettiConfig }} />
          </ConfettiContainer>
          <Participants fullSized={fullSized}>
            {this.state.participants.map((participant, i) => {
              const isWinner =
                !this.state.shuffling && this.state.winner === participant;

              const highlighted =
                this.state.currentlySelected !== null &&
                this.state.currentlySelected %
                  this.state.participants.length ===
                  i;
              return (
                <Lot
                  innerRef={el => this.setRef(el, participant)}
                  winner={isWinner}
                  highlighted={highlighted}
                  fullSized={fullSized}
                  key={participant.id}
                >
                  {participant.name}
                  <RemoveLotIcon>x</RemoveLotIcon>
                  <RemoveLot
                    onClick={() => this.removeParticipant(participant)}
                  />
                </Lot>
              );
            })}
          </Participants>
          <CSSTransitionGroup
            transitionName="bounce"
            transitionEnterTimeout={600}
            transitionLeaveTimeout={600}
          >
            {shuffleButtonVisible && (
              <ShuffleButtonContainer>
                <ShuffleButton
                  disabled={this.state.shuffling}
                  key="shuffle"
                  onClick={this.shuffle}
                >
                  Suorita arvonta
                </ShuffleButton>
              </ShuffleButtonContainer>
            )}
          </CSSTransitionGroup>
        </Content>
        <style>
          {`
          .center-enter {
            width: ${this.state.popupStart.width}px;
            min-height: ${this.state.popupStart.height}px;
            max-height: ${this.state.popupStart.height}px;
            top: ${this.state.popupStart.top}px;
            left: ${this.state.popupStart.left}px;
          }
        `}
        </style>
        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {winnerModalOpen && <Fade onClick={this.closeModal} />}
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionName="center"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={10}
        >
          {winnerModalOpen && (
            <WinnerPopup>
              <WinnerPopupOpening className="winner-popup-opening-content">
                <span>{this.state.winner.name}</span>
              </WinnerPopupOpening>
              <WinnerPopupOpen className="winner-popup-open-content">
                <WinnerLabel>
                  {/* Paras mahdollinen vaihtoehto on:*/}
                  Ja voittaja on:
                </WinnerLabel>
                <WinnerText>
                  {this.state.winner.name}{" "}
                  <span aria-label="tada emoji" role="img">
                    🎉
                  </span>
                </WinnerText>
                <Social>
                  <FacebookShareButtonContainer
                    url={window.location.href}
                    quote={`Arpaonni suosi tällä kertaa osallistujaa ${
                      this.state.winner.name
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
                      this.state.winner.name
                    } - Olet paras! Pidä tästä kiinni myös jatkossa.`}
                  >
                    <div ref={this.twitterShareRef} />
                    <FacebookShareButtonContent onClick={this.shareInTwitter}>
                      {this.state.generatingUrl &&
                      this.state.generatingForTwitter ? (
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
                    <UrlShareButtonContainer
                      onClick={() => this.generateShortUrl()}
                    >
                      {this.state.generatingUrl &&
                      !this.state.generatingForTwitter ? (
                        <img src={loader} alt="Loading" />
                      ) : (
                        <UrlIcon />
                      )}
                      <FacebookShareButtonText>
                        Jaa linkki
                      </FacebookShareButtonText>
                    </UrlShareButtonContainer>
                  ) : (
                    <UrlInput readOnly value={this.state.url} />
                  )}
                </Social>
                <CloseModal onClick={this.closeModal}>
                  <CloseIcon />
                </CloseModal>
              </WinnerPopupOpen>
            </WinnerPopup>
          )}
        </CSSTransitionGroup>
      </AppContainer>
    );
  }
}

export default App;

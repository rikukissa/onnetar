import React, { Component } from "react";
import * as Sentry from "@sentry/browser";
import queryString from "query-string";
import styled from "styled-components";
import Textarea from "react-textarea-autosize";
import Confetti from "react-dom-confetti";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { uniqBy } from "lodash-es";
import chicken from "./chicken.svg";
import Guide from "./components/Guide";
import Fade from "./components/Fade";
import CloseIcon from "./components/CloseIcon";
import "./App.css";
import { Header } from "./components/Header";
import { WinnerPopup } from "./components/WinnerPopup";
import { PreviousRaffles } from "./components/PreviousRaffles.tsx";
import { generateUrl } from "./url";
import { Footer } from "./components/Footer";
import { MOBILE_WIDTH, IS_MOBILE, STANDALONE } from "./mobile";
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
  window.history.pushState(
    "page2",
    "Title",
    generateUrl(state.participants, state.seed)
  );
}

function storeRaffle(participants) {
  const storedData = getLocallyStoredData();
  storeDataLocally({
    ...storedData,
    previousRaffles: storedData.previousRaffles.concat({
      participants,
      createdAt: new Date()
    })
  });
}

function storeDataLocally(data) {
  window.localStorage.setItem("onnetar", JSON.stringify(data));
}

function getLocallyStoredData() {
  return (
    JSON.parse(window.localStorage.getItem("onnetar") || "null") || {
      previousRaffles: []
    }
  );
}

function getStoredState() {
  const urlParams = queryString.parse(window.location.search);
  const storedData = getLocallyStoredData();

  const participants = urlParams.p
    ? urlParams.p.split(",").map((name, id) => ({ name, id }))
    : [];

  const hasSeed = Boolean(urlParams.s);

  const state = {
    ...storedData,
    seed: hasSeed ? parseInt(urlParams.s, 10) : 0,
    participants
  };

  if (hasSeed) {
    state.winner = participants[getWinnerIndex(participants, state.seed)];
  }
  return state;
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

function getWinnerIndex(participants, seed) {
  return Math.floor(participants.length * random(seed));
}

const AppContainer = styled.div`
  transition: padding 1300ms;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Intro = styled.section`
  font-size: 18px;
  text-align: center;
  margin-bottom: 2em;
  margin-top: 1em;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
  font-weight: bold;
  color: #615f5f;
  font-size: 18px;
`;

const AddParticipantForm = styled.form``;

const Tip = styled.div`
  margin-top: 1em;
  font-size: 18px;
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
  width: 100%;
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

const Content = styled.div`
  flex-grow: 1;
  max-width: 800px;
  margin: auto;
  padding: 0 1em;
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
  @media (max-width: ${MOBILE_WIDTH}px) {
    font-size: 20px;
  }
  &:disabled {
    opacity: 0.5;
  }
`;

const ResetButton = styled(ShuffleButton)`
  margin: auto;
  margin-top: 2rem;
  width: 150px;
  background: #f95353;
  padding: 1rem;
  font-size: 16px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
`;

const ShuffleButtonContainer = styled.div`
  margin-top: 2em;
  text-align: right;
  max-height: 500px;
  overflow: hidden;
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
  padding: 0.5em 1em;
  padding-right: 3em;
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

const RemoveIcon = styled(CloseIcon)`
  fill: #fff;
  position: absolute;
  right: 1em;
  width: 16px;
  height: 16px;
  top: 50%;
  margin-top: -7px;
`;

class App extends Component {
  state = {
    currentName: "",
    participants: [],
    currentlySelected: null,
    shuffling: false,
    popupStart: { top: 0, left: 0 },
    currentPlaceholder:
      PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)],
    seed: 0,
    url: "",
    ...getStoredState()
  };
  elements = {};
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
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
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
  reset = () => {
    this.setParticipants([]);
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
    const winnerIndex = getWinnerIndex(allParticipants, seed);
    const winner = allParticipants[winnerIndex];

    this.setState(state => {
      const newState = {
        ...state,
        shuffling: true,
        url: "",
        currentName: "",
        seed,
        participants: allParticipants,
        targetIndex:
          Math.floor(MIN_SHUFFLES / allParticipants.length) *
            allParticipants.length +
          winnerIndex,
        winner
      };

      writeToUrl(newState);
      storeRaffle(allParticipants);

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
    this.setState(
      () => ({
        winner: null,
        seed: null
      }),
      () => writeToUrl(this.state)
    );
  };
  render() {
    const cantAdd = this.state.currentName === "";
    const multipleParticipantsInTextInput =
      splitToNames(this.state.currentName).length > 1;

    const winnerModalOpen = !this.state.shuffling && this.state.winner;
    const fullSized = this.state.participants.length < 6;
    const participantsInputted =
      this.state.participants.length > 1 || multipleParticipantsInTextInput;

    const allowedToShuffle =
      !this.state.winner && !this.state.shuffling && participantsInputted;

    return (
      <AppContainer>
        <Header />
        <Content>
          {!STANDALONE && (
            <Intro>
              <p>
                Heitä noppa roskakoriin ja lopeta työläs paperilappujen
                repiminen ja anna Onnettaren hoitaa arpominen puolestasi. Oman
                arvonnan luominen ei koskaan ole ollut näin helppoa!
              </p>
              <p>
                Voit myös halutessasi jakaa arvonnan tuloksen kavereillesi
                Facebookissa ja Twitterissä. <br />
                <br />
                <strong>
                  <span role="img" aria-label="onni">
                    ✨
                  </span>
                  Onnea arvontaan!
                </strong>
              </p>
            </Intro>
          )}
          <Guide />

          <AddParticipantForm onSubmit={this.addParticipant}>
            <Label>Lisää arvontaan osallistujat:</Label>

            <AddParticipantWrapper>
              <AddParticipantInput
                rows={1}
                minRows={IS_MOBILE ? 2 : undefined}
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
                  <RemoveIcon>x</RemoveIcon>
                  <RemoveLot
                    onClick={() => this.removeParticipant(participant)}
                  />
                </Lot>
              );
            })}
          </Participants>

          <ShuffleButtonContainer>
            <ShuffleButton
              disabled={!allowedToShuffle}
              key="shuffle"
              onClick={this.shuffle}
            >
              Suorita arvonta
            </ShuffleButton>
            <ResetButton disabled={!allowedToShuffle} onClick={this.reset}>
              Tyhjennä
            </ResetButton>
          </ShuffleButtonContainer>

          {this.state.previousRaffles.length > 0 && (
            <PreviousRaffles previousRaffles={this.state.previousRaffles} />
          )}
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
            <WinnerPopup
              winner={this.state.winner}
              onCloseModal={this.closeModal}
            />
          )}
        </CSSTransitionGroup>
        <Footer />
      </AppContainer>
    );
  }
}

export default App;

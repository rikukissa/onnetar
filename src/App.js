import React, {Component} from 'react';
import queryString from 'query-string';
import styled from 'styled-components';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import logo from './logo.svg';
import chicken from './chicken.svg';

import {ShareButtons, generateShareIcon} from 'react-share';

const {FacebookShareButton} = ShareButtons;

import './App.css';

function createSeed(participants, timeSeed) {
  return timeSeed +
    participants
      .map(({name}) => name)
      .join('')
      .split('')
      .map(char => char.charCodeAt(0))
      .reduce((total, charCode) => total + charCode);
}

function writeToUrl(state) {
  const storedState = {
    s: state.seed,
    p: state.participants.map(({name}) => name).join(','),
  };

  window.history.pushState('page2', 'Title', '/?' + queryString.stringify(storedState));
}

function getStoredState() {
  const urlParams = queryString.parse(window.location.search);

  return {
    seed: urlParams.s === undefined ? 0 : parseInt(urlParams.s, 10),
    participants: urlParams.p ? urlParams.p.split(',').map((name, id) => ({name, id})) : [],
  };
}

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleEasing(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

const AppContainer = styled.div`
  padding-bottom: 140px;
`;

const Logo = styled.img`
  margin-right: -15px;
  margin-top: 5px;
  width: 110px;
  @media (max-width: 380px) {
    flex-shrink: 1;
    width: 100%;
  }
`;

const Description = styled.div`
  line-height: 1.5em;
  color: #a0a0a0;
  margin-top: -19px;
  font-size: 19px;
  font-weight: 600;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
  font-weight: bold;
  color: #615f5f;
  font-size: 16px;
`;

const AddParticipantForm = styled.form`
  padding: 1em;
`;

const Tip = styled.div`
  margin-top: 1em;
`;
const CloseModal = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  font-size: 28px;
  color: #ffb100;
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
  font-weight: bold;
  border-radius: 0 3px 3px 0;
`;

const AddParticipantInput = styled.textarea`
  font-family: inherit;
  font-size: 26px;
  padding: 0.75em;
  flex-grow: 1;
  border: 4px solid #9143c1;
  border-right-width: 0;
  border-radius: 3px 0 0 3px;
`;

const Hero = styled.div`
  display: flex;
  padding: 1em;
`;

const Title = styled.h1`
  font-size: 56px;
  font-family: 'blenny', sans-serif;
  margin-top: 0;
  margin-bottom: 0;
  color: #9143c1;
  @media (max-width: 380px) {
    font-size: 40px;
  }
`;

const Content = styled.div`
  flex-grow: 1;
`;

const ShuffleButton = styled.div`
  bottom: 1rem;
  width: 200px;
  cursor: pointer;
  right: 1rem;
  border: 0;
  color: #fff;
  background: #2c9eff;
  position: fixed;
  display: block;
  padding: 0.5em;
  font: inherit;
  font-size: 40px;
  font-weight: 600;
  border-radius: 5px;
  text-align: center;
  z-index: 2;
`;

const ShuffleButtonImage = styled.img`
  width: 80px;
`;

const Participants = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.5em;
  justify-content: center;
`;

const Lot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({highlighted}) => highlighted ? '#ffb100' : '#65d065'};
  z-index: ${({highlighted, winner}) => highlighted || winner ? 1 : 0};
  ${({highlighted}) => highlighted ? 'transform: scale(1.5, 1.5)' : ''};
  transition: transform 200ms;
  margin: 1em 0.5em;
  padding: 0.5em;
  font-weight: bold;
  color: #fff;
  font-size: 18px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  min-width: 4em;
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
    content: 'Poista';
    background: red;
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

const WinnerPopup = styled.div`
  position: fixed;
  width: 90%;
  top: 50%;
  left: 50%;
  padding: 0.5em;
  z-index: 3;
  border: 5px solid #ffb100;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414zm16 0L90 80.414 95.586 86H84.414zm16 0L106 80.414 111.586 86h-11.172zm-8-6h11.173L98 85.586 92.414 80zM82 85.586L87.586 80H76.414L82 85.586zM17.414 0L.707 16.707 0 17.414V0h17.414zM4.28 0L0 12.838V0h4.28zm10.306 0L2.288 12.298 6.388 0h8.198zM180 17.414L162.586 0H180v17.414zM165.414 0l12.298 12.298L173.612 0h-8.198zM180 12.838L175.72 0H180v12.838zM0 163h16.413l.5.5 7.294 7.293L25.414 172l-8 8H0v-17zm0 10h6.613l-2.334 7H0v-7zm14.586 7l7-7H8.72l-2.333 7h8.2zM0 165.414L5.586 171H0v-5.586zM10.414 171L16 165.414 21.586 171H10.414zm-8-6h11.172L8 170.586 2.414 165zM180 163h-16.413l-7.794 7.793-1.207 1.207 8 8H180v-17zm-14.586 17l-7-7h12.865l2.333 7h-8.2zM180 173h-6.613l2.334 7H180v-7zm-21.586-2l5.586-5.586 5.586 5.586h-11.172zM180 165.414L174.414 171H180v-5.586zm-8 5.172l5.586-5.586h-11.172l5.586 5.586zM152.933 25.653l1.414 1.414-33.94 33.942-1.416-1.416 33.943-33.94zm1.414 127.28l-1.414 1.414-33.942-33.94 1.416-1.416 33.94 33.943zm-127.28 1.414l-1.414-1.414 33.94-33.942 1.416 1.416-33.943 33.94zm-1.414-127.28l1.414-1.414 33.942 33.94-1.416 1.416-33.94-33.943zM0 85c2.21 0 4 1.79 4 4s-1.79 4-4 4v-8zm180 0c-2.21 0-4 1.79-4 4s1.79 4 4 4v-8zM94 0c0 2.21-1.79 4-4 4s-4-1.79-4-4h8zm0 180c0-2.21-1.79-4-4-4s-4 1.79-4 4h8z' fill='%23eca417' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
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
  font-size: 19px;
`;
const WinnerText = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: 55px;
  color: #ffb100;
`;

const FacebookIcon = generateShareIcon('facebook');

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

class App extends Component {
  state = {
    currentName: '',
    participants: [],
    currentlySelected: null,
    shuffling: false,
    popupStart: {top: 0, left: 0},
    seed: 0,
  };
  elements = {};
  componentDidMount() {
    this.setState(() => getStoredState());
  }
  componentDidUpdate() {
    writeToUrl(this.state);
  }
  updateName = event => {
    const name = event.target.value;
    this.setState(() => ({
      currentName: name,
    }));
  };
  addParticipant = event => {
    event.preventDefault();
    const participantsLength = this.state.participants.length;

    const names = this.state.currentName
      .split(/[,;\n]/gi)
      .map(name => name.trim())
      .map((name, i) => ({
        id: participantsLength + i,
        name,
      }));

    this.setState(state => {
      const participants = state.participants.concat(names);
      return {
        participants,
        currentName: '',
      };
    });
  };
  loop = () => {
    if (this.state.currentlySelected === this.state.targetIndex) {
      const winnerLotRect = this.elements[this.state.winner.id].getBoundingClientRect();
      this.setState(() => ({
        shuffling: false,
        currentlySelected: null,
        popupStart: {
          top: winnerLotRect.top + winnerLotRect.height / 2,
          left: winnerLotRect.left + winnerLotRect.width / 2,
          width: winnerLotRect.width,
          height: winnerLotRect.height,
        },
      }));
      return;
    }

    this.setState(
      ({participants, currentlySelected}) => ({
        currentlySelected: currentlySelected === null ? 0 : currentlySelected + 1,
      }),
      () =>
        setTimeout(
          this.loop,
          Math.max(100, shuffleEasing(this.state.currentlySelected / this.state.targetIndex) * 200),
        ),
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
    const {participants} = this.state;
    const seed = this.state.seed || createSeed(participants, Date.now());
    const winnerIndex = Math.floor(participants.length * random(seed));
    const winner = participants[winnerIndex];

    this.setState(
      () => ({
        shuffling: true,
        seed,
        targetIndex: participants.length * 2 + winnerIndex,
        winner: participants[winnerIndex],
      }),
      this.loop,
    );
  };
  removeParticipant = participant => {
    this.setState(({participants}) => ({
      participants: participants.filter(p => p !== participant),
    }));
  };
  closeModal = () => {
    this.setState(() => ({
      winner: null,
      seed: null,
    }));
  };
  render() {
    const canAdd = this.state.currentName === '';

    return (
      <AppContainer>
        <Hero>
          <Logo src={logo} alt="logo" />
          <div>
            <Title>Onnetar</Title>
            <Description>
              Oma arvonta vaivattomasti
            </Description>
          </div>
        </Hero>
        <Content>
          <AddParticipantForm onSubmit={this.addParticipant}>
            <Label>Aloita lisäämällä arvontaan osallistujat:</Label>

            <AddParticipantWrapper>

              <AddParticipantInput
                rows="1"
                onKeyDown={this.submitIfEnter}
                value={this.state.currentName}
                onChange={this.updateName}
                type="text"
              />
              <AddParticipantButton disabled={canAdd}>
                Lisää<br /> osallistuja
              </AddParticipantButton>
            </AddParticipantWrapper>
            <Tip>
              Voit lisätä useita osallistujia yhdellä kertaa erottamalla nimet pilkulla, puolipisteellä tai rivinvaihdolla.
            </Tip>
          </AddParticipantForm>
          <Participants>
            {this.state.participants.map((participant, i) => {
              const isWinner = !this.state.shuffling && this.state.winner === participant;

              const highlighted = this.state.currentlySelected !== null &&
                this.state.currentlySelected % this.state.participants.length === i;
              return (
                <Lot
                  innerRef={el => this.setRef(el, participant)}
                  winner={isWinner}
                  highlighted={highlighted}
                  key={participant.id}
                >
                  {participant.name}
                  <RemoveLot onClick={() => this.removeParticipant(participant)} />
                </Lot>
              );
            })}
          </Participants>
        </Content>
        <CSSTransitionGroup
          transitionName="bounce"
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}
        >
          {!this.state.winner &&
            this.state.participants.length > 1 &&
            !this.state.shuffling &&
            <ShuffleButton key="shuffle" onClick={this.shuffle}>
              <ShuffleButtonImage src={chicken} alt="chicken" />
              Suorita arvonta
            </ShuffleButton>}
        </CSSTransitionGroup>
        <style>
          {
            `
          .center-enter {
            width: ${this.state.popupStart.width}px;
            min-height: ${this.state.popupStart.height}px;
            max-height: ${this.state.popupStart.height}px;
            top: ${this.state.popupStart.top}px;
            left: ${this.state.popupStart.left}px;
          }
        `
          }
        </style>
        <CSSTransitionGroup
          transitionName="center"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={10}
        >
          {!this.state.shuffling &&
            this.state.winner &&
            <WinnerPopup>
              <WinnerPopupOpening className="winner-popup-opening-content">
                <span>
                  {this.state.winner.name}
                </span>
              </WinnerPopupOpening>
              <WinnerPopupOpen className="winner-popup-open-content">
                <WinnerLabel>
                  Ja voittaja on:
                </WinnerLabel>
                <WinnerText>
                  {this.state.winner.name}
                </WinnerText>
                <FacebookShareButton
                  url={window.location.href}
                  title="Onnetar"
                  picture="http://onnetar.fi/logo.png"
                  description={
                    `Arpaonni suosi tällä kertaa osallistujaa ${this.state.winner.name}. Onnea!`
                  }
                >
                  <FacebookShareButtonContent>
                    <FacebookIcon size={32} round />
                    <FacebookShareButtonText>
                      Jaa tulos Facebookissa
                    </FacebookShareButtonText>
                  </FacebookShareButtonContent>
                </FacebookShareButton>
                <CloseModal onClick={this.closeModal}>X</CloseModal>
              </WinnerPopupOpen>
            </WinnerPopup>}
        </CSSTransitionGroup>
      </AppContainer>
    );
  }
}

export default App;

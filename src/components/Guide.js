import React, { Component } from "react";
import styled from "styled-components";

import step1 from "../step1.svg";
import step2 from "../step2.svg";
import step3 from "../step3.svg";

import CloseIcon from "./CloseIcon";

const Container = styled.div`
  padding: 1em;
  margin: 2em 0;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414zm16 0L90 80.414 95.586 86H84.414zm16 0L106 80.414 111.586 86h-11.172zm-8-6h11.173L98 85.586 92.414 80zM82 85.586L87.586 80H76.414L82 85.586zM17.414 0L.707 16.707 0 17.414V0h17.414zM4.28 0L0 12.838V0h4.28zm10.306 0L2.288 12.298 6.388 0h8.198zM180 17.414L162.586 0H180v17.414zM165.414 0l12.298 12.298L173.612 0h-8.198zM180 12.838L175.72 0H180v12.838zM0 163h16.413l.5.5 7.294 7.293L25.414 172l-8 8H0v-17zm0 10h6.613l-2.334 7H0v-7zm14.586 7l7-7H8.72l-2.333 7h8.2zM0 165.414L5.586 171H0v-5.586zM10.414 171L16 165.414 21.586 171H10.414zm-8-6h11.172L8 170.586 2.414 165zM180 163h-16.413l-7.794 7.793-1.207 1.207 8 8H180v-17zm-14.586 17l-7-7h12.865l2.333 7h-8.2zM180 173h-6.613l2.334 7H180v-7zm-21.586-2l5.586-5.586 5.586 5.586h-11.172zM180 165.414L174.414 171H180v-5.586zm-8 5.172l5.586-5.586h-11.172l5.586 5.586zM152.933 25.653l1.414 1.414-33.94 33.942-1.416-1.416 33.943-33.94zm1.414 127.28l-1.414 1.414-33.942-33.94 1.416-1.416 33.94 33.943zm-127.28 1.414l-1.414-1.414 33.94-33.942 1.416 1.416-33.943 33.94zm-1.414-127.28l1.414-1.414 33.942 33.94-1.416 1.416-33.94-33.943zM0 85c2.21 0 4 1.79 4 4s-1.79 4-4 4v-8zm180 0c-2.21 0-4 1.79-4 4s1.79 4 4 4v-8zM94 0c0 2.21-1.79 4-4 4s-4-1.79-4-4h8zm0 180c0-2.21-1.79-4-4-4s-4 1.79-4 4h8z' fill='%23eca417' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E");
  position: relative;
  border-radius: 5px;
  border: 5px solid #ffb100;
`;

const Close = styled.div`
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  cursor: pointer;
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Column = styled.div`
  flex: 0.33;
  position: relative;
  min-width: 200px;
  max-width: 260px;
  flex-basis: auto;
`;

const GuideNumber = styled.div`
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
  height: 1.5em;
  text-align: center;
  width: 1.5em;
  flex-direction: column;
  display: flex;
  font-size: 16px;
  border: 3px solid;
  border-radius: 1000px;
  justify-content: center;
  align-items: center;
`;

const GuideImageContainer = styled.div`
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const GuideImage = styled.img`
  width: 200px;
  height: 120px;
  display: block;
  margin: auto;
`;

const GuideTitle = styled.h2`
  text-align: center;
`;

const GuideDescription = styled.h2`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
`;

const DEFAULT_CONFIG = {
  guideClosed: false
};

function getConfig() {
  let config = DEFAULT_CONFIG;
  try {
    config =
      JSON.parse(window.localStorage.getItem("config")) || DEFAULT_CONFIG;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  return config;
}

function updateConfig(patch) {
  window.localStorage.setItem(
    "config",
    JSON.stringify({ ...getConfig(), ...patch })
  );
}

export default class Guide extends Component {
  state = {
    closed: getConfig().guideClosed
  };
  closeGuide = () => {
    updateConfig({ guideClosed: true });
    this.setState({ closed: true });
  };
  render() {
    if (this.state.closed) {
      return <div />;
    }

    return (
      <Container>
        <Close onClick={this.closeGuide}>
          <CloseIcon />
        </Close>
        <GuideTitle>3 äärimmäisen helppoa vaihetta:</GuideTitle>
        <Columns>
          <Column>
            <GuideNumber>1.</GuideNumber>
            <GuideImageContainer>
              <GuideImage src={step1} alt="Valitse osallistujat" />
            </GuideImageContainer>
            <GuideDescription>Päätä arvontaan osallistujat</GuideDescription>
          </Column>
          <Column>
            <GuideNumber>2.</GuideNumber>
            <GuideImageContainer>
              <GuideImage src={step2} alt="Syötä osallistujat Onnettarelle" />
            </GuideImageContainer>
            <GuideDescription>
              Syötä osallistujat alla olevaan tekstikenttään
            </GuideDescription>
          </Column>
          <Column>
            <GuideNumber>3.</GuideNumber>
            <GuideImageContainer>
              <GuideImage src={step3} alt="Arvo" />
            </GuideImageContainer>
            <GuideDescription>
              Paina ruudun alareunaan ilmestyvää arvontapainiketta
            </GuideDescription>
          </Column>
        </Columns>
      </Container>
    );
  }
}

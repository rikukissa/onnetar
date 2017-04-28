import React from 'react';
import styled from 'styled-components';

import step1 from '../step1.svg';
import step2 from '../step2.svg';
import step3 from '../step3.svg';

const Container = styled.div`
  padding: 1em;
  margin-top: 1em;
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

const GuideDescription = styled.p`
  text-align: center;
`;

export default function Guide() {
  return (
    <Container>
      <GuideTitle>3 helppoa vaihetta:</GuideTitle>
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
          <GuideDescription>Syötä osallistujat alla olevaan tekstikenttään</GuideDescription>
        </Column>
        <Column>
          <GuideNumber>3.</GuideNumber>
          <GuideImageContainer>
            <GuideImage src={step3} alt="Arvo" />
          </GuideImageContainer>
          <GuideDescription>Paina ruudun alareunaan ilmestyvää arvontapainiketta</GuideDescription>
        </Column>
      </Columns>
    </Container>
  );
}

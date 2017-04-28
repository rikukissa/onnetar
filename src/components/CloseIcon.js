import React from 'react';
import styled from 'styled-components';
import close from '../close.svg';

const Container = styled.img`
  width: 32px;
`;

export default function CloseIcon({ className }) {
  return <Container className={className} src={close} alt="Sulje" />;
}

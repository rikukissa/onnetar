import * as React from "react";
import styled from "styled-components";

const Container = styled.footer`
  padding: 1.5em 2em;
  margin-top: 2em;
  font-size: 18px;
  text-align: right;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

export function Footer() {
  return (
    <Container>
      <a target="_blank" href="https://okay.codes">
        👌 okay codes
      </a>
    </Container>
  );
}

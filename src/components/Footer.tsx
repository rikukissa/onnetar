import * as React from "react";
import styled from "styled-components";

const Container = styled.footer`
  padding: 0.5em;
  margin-top: 2em;
  a {
    color: inherit;
    font-weight: bold;
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

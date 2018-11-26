import uniqBy from "lodash-es/uniqBy";
import * as React from "react";
import styled from "styled-components";
import { generateUrl } from "../url";
const Subtitle = styled.h2``;

const PreviousRafflesContainer = styled.section`
  border-top: 2px solid #efefef;
  margin-top: 3em;
  padding: 1em 0;
`;
const Raffles = styled.ol`
  display: flex;
  list-style: none;
  padding: 0;
  margin: -0.5em;
  flex-wrap: wrap;
`;

const Raffle = styled.li`
  border-radius: 5px;
  background: linear-gradient(135deg, #1e5799 0%, #63c5ff 0%, #4281ff 100%);
  width: calc(33.3% - 1em);
  margin: 0.5em;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const Link = styled.a`
  padding: 1.5em;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 5em;
  justify-content: center;
  align-items: center;
`;

const RaffleParticipants = styled.span`
  font-size: 22px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
  font-weight: bold;
`;

interface IParticipant {
  name: string;
}
interface IPreviousRaffle {
  participants: IParticipant[];
  createdAt: string;
}

interface IPreviousRafflesProps {
  previousRaffles: IPreviousRaffle[];
}

function compareStrings(a: string, b: string) {
  return a.localeCompare(b);
}

export class PreviousRaffles extends React.Component<IPreviousRafflesProps> {
  public render() {
    const previousRaffles = [...this.props.previousRaffles]
      .sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      )
      .slice(0, 6);

    const uniqueRaffles = uniqBy(previousRaffles, raffle =>
      raffle.participants
        .map(({ name }) => name)
        .sort(compareStrings)
        .join(",")
    );

    return (
      <PreviousRafflesContainer>
        <Subtitle>
          <span role="img" aria-label="tada emoji">
            🎲
          </span>{" "}
          Viimeisimmät arvontasi:
        </Subtitle>
        <Raffles>
          {uniqueRaffles.map(({ participants, createdAt }) => (
            <Raffle key={createdAt}>
              <Link href={generateUrl(participants)}>
                <RaffleParticipants>
                  {participants.map(({ name }) => name).join(", ")}
                </RaffleParticipants>
              </Link>
            </Raffle>
          ))}
        </Raffles>
      </PreviousRafflesContainer>
    );
  }
}

import * as React from "react";
import styled, { keyframes } from "styled-components";
import CloseIcon from "./CloseIcon";

const fadeIn = keyframes`
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const slideUp = keyframes`
  from {
    bottom: -100%;
  }
  to {
    bottom: 0;
  }
`;

const Container = styled.footer`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 300ms;
  position: fixed;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const Content = styled.div`
  margin-left: 0;
  background: #fff;
  border-radius: 3px;
  padding: 2em;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.05);
  text-align: left;
  animation: ${slideUp} 300ms;
  font-size: 16px;
  position: relative;
  h3 {
    font-size: 25px;
    margin-top: 0;
    margin-bottom: 1rem;
  }
`;

const Close = styled(CloseIcon)`
  position: absolute;
  right: 1em;
  top: 1em;
  fill: #615f5f;
`;

const Button = styled.button`
  width: 100%;
  cursor: pointer;
  border: 0;
  color: #fff;
  background: #2c9eff;
  padding: 1rem;
  font: inherit;
  font-size: 20px;
  font-weight: 600;
  border-radius: 5px;
  margin-top: 1em;
`;

interface IState {
  visible: boolean;
  prompt: IBeforeInstallPromptEvent | null;
}

type IAction =
  | {
      type: "show";
      prompt: IBeforeInstallPromptEvent;
    }
  | {
      type: "hide";
    };

const initialState: IState = {
  visible: false,
  prompt: null
};

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case "hide":
      return { ...state, visible: false };
    case "show":
      return { ...state, visible: true };
    default:
      // A reducer must always return a valid state.
      // Alternatively you can throw an error if an invalid action is dispatched.
      return state;
  }
}
export function AddToHomeScreen() {
  const [state, dispatch] = React.useReducer<IState, IAction>(
    reducer,
    initialState
  );

  const hide = () => dispatch({ type: "hide" });
  const install = () => {
    hide();
    if (state.prompt) {
      state.prompt.prompt();
    }
  };

  React.useEffect(() => {
    const showPrompt = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault();
      dispatch({ type: "show", prompt: e });
    };
    window.addEventListener("beforeinstallprompt", showPrompt as any);
    return () => {
      window.removeEventListener("beforeinstallprompt", showPrompt as any);
    };
  }, []);

  if (!state.visible) {
    return <div />;
  }

  return (
    <Container onClick={hide}>
      <Content>
        <Close onClick={hide} />
        <h3>Moi!</h3>
        Onnettaren voi myös lisätä kotivalikkoon, josta se toimii ihan niinkuin
        mikä tahansa muukin app 😍
        <Button onClick={install}>Lisää kotivalikkoon</Button>
      </Content>
    </Container>
  );
}

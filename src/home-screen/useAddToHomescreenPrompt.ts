import * as React from "react";

interface IState {
  isVisible: boolean;
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
  isVisible: false,
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
      return { ...state, isVisible: false };
    case "show":
      return { ...state, isVisible: true, prompt: action.prompt };
    default:
      return state;
  }
}

export function useAddToHomescreenPrompt(): [boolean, () => void, () => void] {
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

  return [state.isVisible, hide, install];
}

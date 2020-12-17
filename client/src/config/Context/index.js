import { createContext, useReducer } from "react";

export const AppContext = createContext();

const initialState = {
  isLogin: false,
  isLoading: true,
  posts: [{}],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_POSTS":
      return {
        ...state,
        posts: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return {
        ...state,
        isLogin: false,
        isLoading: false,
      };
    default:
      throw new Error();
  }
};

export const Context = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};

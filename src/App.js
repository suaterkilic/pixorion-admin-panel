import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import Rota from "./Router";

const App = () => {
  return (
    <Provider store={store}>
      <Rota />
    </Provider>
  );
};

export default App;

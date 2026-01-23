import { Provider } from "react-redux";
import { store } from "./app/store";
import { createRoot } from "react-dom/client";
import "./styles/variables.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ThemeProvider } from "./styles/ThemeProvider";
import { defaultTheme } from "./styles/theme";
import "./styles/variables.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider initialTheme={defaultTheme}>
      <App />
    </ThemeProvider>
  </Provider>,
);

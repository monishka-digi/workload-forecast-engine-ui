import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/light.css";
import "./styles/dark.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
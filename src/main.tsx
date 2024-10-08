import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { StateContextProvider } from "./context/index.tsx";

createRoot(document.getElementById("root")!).render(
  <PrivyProvider
    appId={import.meta.env.VITE_PRIVY_APP_ID}
    config={{
      loginMethods: ["email"],
      appearance: {
        theme: "dark",
        accentColor: "#0ea5e9",
        logo: "/logo.png",
      },
    }}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </PrivyProvider>
);

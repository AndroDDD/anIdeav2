import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import RouterBlock, { domain, clientId } from "./routes/routerBlock";

function App() {
  return (
    <>
      <Auth0Provider
        domain={`${domain}`}
        clientId={`${clientId}`}
        redirectUri={window[`location`][`href`]}
      >
        <RouterBlock />
      </Auth0Provider>
    </>
  );
}

export default App;

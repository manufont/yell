import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import App from "./App";

function Layout() {
  return (
    <BrowserRouter>
      <Route path="/">
        <App />
      </Route>
    </BrowserRouter>
  );
}

export default Layout;

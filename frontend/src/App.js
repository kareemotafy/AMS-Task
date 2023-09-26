import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import _ from "lodash";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Home from "./pages/Home";
import GeneralLoading from "./components/GeneralLoading";

//test
const generateRoutes = (routes) => {
  return _.flatten(
    routes.map(({ path, element, children, skipCookie }) => {
      const nestedRoutes =
        children?.length > 0
          ? generateRoutes(children).map(
              ({ path: nestedPath, element, skipCookie }) => {
                return (
                  <Route
                    key={nestedPath}
                    path={path + nestedPath}
                    exact
                    element={element}
                  />
                );
              }
            )
          : null;

      return [
        <Route path={path} exact element={element} key={path} />,
        nestedRoutes?.length > 0 && nestedRoutes,
      ];
    })
  );
};

const routes = [
  { path: "/register", element: <Register />, skipCookie: true },
  { path: "/sign-in", element: <SignIn />, skipCookie: true },
  { path: "/", element: <Home /> },
];

function App() {
  const renderedRoutes = generateRoutes(routes);

  return (
    <>
      <Suspense fallback={<GeneralLoading />}>
        <Routes>{renderedRoutes}</Routes>
      </Suspense>
    </>
  );
}

export default App;

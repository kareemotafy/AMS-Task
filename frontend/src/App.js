import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import _ from "lodash";

import "./styles/App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Home from "./pages/Home";
import GeneralLoading from "./components/GeneralLoading";
import axios from "axios";
import { useCookies } from "react-cookie";

const ProtectedComponent = (component) => {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const verifyCookie = async () => {
    if (!cookies.token) {
      navigate("/sign-in");
    }
  };
  useEffect(() => {
    verifyCookie();
  }, []);

  return <>{component}</>;
};

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
                    element={skipCookie ? element : ProtectedComponent(element)}
                  />
                );
              }
            )
          : null;

      return [
        <Route
          path={path}
          exact
          element={skipCookie ? element : ProtectedComponent(element)}
          key={path}
        />,
        nestedRoutes?.length > 0 && nestedRoutes,
      ];
    })
  );
};

const routes = [
  { path: "/register", element: <Register />, skipCookie: true },
  { path: "/sign-in", element: <SignIn />, skipCookie: true },
  { path: "*", element: <h1>404</h1>, skipCookie: true },
  { path: "/", element: <Home /> },
];

function App() {
  const renderedRoutes = generateRoutes(routes);

  axios.defaults.baseURL = "http://localhost:1337/api";
  axios.defaults.withCredentials = true;

  return (
    <>
      <Suspense fallback={<GeneralLoading />}>
        <Routes>{renderedRoutes}</Routes>
      </Suspense>
    </>
  );
}

export default App;

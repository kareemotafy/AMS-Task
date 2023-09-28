import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./styles/App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Staff from "./pages/Staff";
import Home from "./pages/Home";
import GeneralLoading from "./components/GeneralLoading";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./components/Navbar";

const ProtectedComponent = (component) => {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/sign-in");
      }
    };
    verifyCookie();
  }, [cookies, navigate]);

  return (
    <>
      <Navbar />
      <div style={{ marginRight: 50, marginLeft: 50 }}>{component}</div>
    </>
  );
};

//test
const generateRoutes = (routes) => {
  return routes.map(({ path, element, skipCookie }) => (
    <Route
      path={path}
      exact
      element={skipCookie ? element : ProtectedComponent(element)}
      key={path}
    />
  ));
};

const routes = [
  { path: "/register", element: <Register />, skipCookie: true },
  { path: "/sign-in", element: <SignIn />, skipCookie: true },
  { path: "*", element: <h1>404</h1>, skipCookie: true },
  { path: "/", element: <Home /> },
  { path: "/staff", element: <Staff /> },
];

function App() {
  const renderedRoutes = generateRoutes(routes);

  axios.defaults.baseURL = "http://localhost:1337/api";
  axios.defaults.withCredentials = true;

  return (
    <>
      <Suspense fallback={<GeneralLoading />}>
        <Routes>
          {renderedRoutes.filter((route) => !route.skipCookie)}
          {renderedRoutes.filter((route) => route.skipCookie === true)}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

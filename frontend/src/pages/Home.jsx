import React, { useState, useEffect } from "react";
import axios from "axios";

import { Grid } from "@mui/material";
const Home = () => {
  const [user, setUser] = useState({});
  const getUserData = async () => {
    try {
      const { data } = await axios.get("/profile");

      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div style={{ marginLeft: 10 }}>
      <Grid container>
        <Grid item xs={12}>
          <h1 style={{ fontWeight: 500 }}>Hello, {user.firstName}</h1>
        </Grid>
        <Grid item xs={12} md={6}>
          <h2>Equipment Requests</h2>
        </Grid>
        <Grid item xs={12} md={6}>
          <h2>Staff Requests</h2>
        </Grid>
      </Grid>
    </div>
  );
};
export default Home;

import React, { useState, useEffect } from "react";
import axios from "axios";

import { Box, Grid, Tab, Tabs } from "@mui/material";
import EquipmentRequests from "./requests/EquipmentRequests";
import StaffRequests from "./requests/StaffRequests";
const Issues = () => {
  const [tabIndex, setTabIndex] = useState("equipment");

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div style={{ marginLeft: 10 }}>
      <Grid container>
        <Grid item xs={12}>
          <h1 style={{ fontWeight: 500 }}>Users</h1>
          <h4 style={{ color: "#0000CD", fontWeight: 300, marginBottom: 20 }}>
            A place to manage the users of this organization.
          </h4>
        </Grid>
      </Grid>
    </div>
  );
};
export default Issues;

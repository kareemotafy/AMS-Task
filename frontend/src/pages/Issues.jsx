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
          <h1 style={{ fontWeight: 500 }}>Issues</h1>
          <h4 style={{ color: "#0000CD", fontWeight: 300, marginBottom: 20 }}>
            Use this page to manage your staff/ equipment issue requests.
          </h4>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabIndex} onChange={handleChange}>
              <Tab label="Equipment" value="equipment" />
              <Tab label="Staff" value="staff" />
            </Tabs>
          </Box>
        </Grid>

        {tabIndex === "equipment" && <Grid item xs={12}></Grid>}
        {tabIndex === "staff" && <Grid item xs={12}></Grid>}
      </Grid>
    </div>
  );
};
export default Issues;

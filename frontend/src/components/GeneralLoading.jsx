import React from "react";
import { CircularProgress, Grid } from "@mui/material";

const GeneralLoading = () => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
};
export default GeneralLoading;

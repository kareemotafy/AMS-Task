import React from "react";
import { Button, Card, Grid, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { showSnackError } from "../tools/utils";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async ({ email, password, lastName, firstName }) => {
    try {
      await axios.post("/register", { email, password, lastName, firstName });

      enqueueSnackbar("Register succesful!", { variant: "success" });
      navigate("/");
    } catch (error) {
      showSnackError(error, "Register failed!", enqueueSnackbar);
    }
  };
  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{
          background: "linear-gradient(to bottom right, #001f3f, #004080)",
          height: "100vh",
        }}
      >
        <Grid item md={6} xs={10}>
          <Card style={{ padding: 30 }}>
            <h1>Welcome!</h1>
            <p style={{ marginBottom: 20 }}>
              Please enter your data to register!
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="First Name"
                        variant="filled"
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Last Name"
                        variant="filled"
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        variant="filled"
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        variant="filled"
                        {...field}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default Register;

import React from "react";
import { Button, Card, Grid, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { showSnackError } from "../../tools/utils";

const SignIn = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async ({ email, password }) => {
    try {
      await axios.post("/signin", { email, password });

      enqueueSnackbar("Sign in succesful!", { variant: "success" });
      navigate("/");
    } catch (error) {
      showSnackError(error, "Sign in failed!", enqueueSnackbar);
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
        <Grid item md={4} xs={11}>
          <Card style={{ padding: 30 }}>
            <h1>Welcome!</h1>
            <p style={{ marginBottom: 20 }}>
              Please enter your data to sign in
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Email"
                        type="email"
                        variant="filled"
                        fullWidth
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
                        type="password"
                        label="Password"
                        variant="filled"
                        fullWidth
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
export default SignIn;

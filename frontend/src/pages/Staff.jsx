import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useModal } from "../contexts/ModalContext";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { showSnackError } from "../tools/utils";

const Staff = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [staff, setStaff] = useState([]);
  const [defaultValues, setDefaultValues] = useState({
    fullName: "",
    type: "",
    description: "",
    active: false,
  });
  const { openModal } = useModal();
  const { control, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    createStaff(data);
  };

  const getStaff = async () => {
    try {
      const { data } = await axios.get("/staff");
      setStaff(data.staff);
    } catch (error) {}
  };

  const createStaff = async (data) => {
    try {
      const {
        data: { staff },
      } = await axios.post("/staff", data);
      getStaff();
      enqueueSnackbar("Staff Created", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Creating Staff", enqueueSnackbar);
    }
  };

  const openAddOrEditStaffModal = () => {
    openModal({
      title: "Add Staff",
      body: (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="filled"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Type"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Description"
                      multiline
                      rows={3}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="active"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Active"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained">
                  submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </>
      ),
    });
  };

  useEffect(() => {
    getStaff();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <h1>Staff</h1>
      </Grid>
      <Grid item xs={12} container justifyContent="right">
        <Button variant="outlined" onClick={openAddOrEditStaffModal}>
          Add
        </Button>
      </Grid>
    </Grid>
  );
};
export default Staff;

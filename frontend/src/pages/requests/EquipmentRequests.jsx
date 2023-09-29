import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useModal } from "../../contexts/ModalContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { mergeDateAndTime, showSnackError } from "../../tools/utils";
import { useSnackbar } from "notistack";

const EquipmentRequests = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { openModal } = useModal();
  const [equipment, setEquipment] = useState([]);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {},
  });

  const getEquipment = async () => {
    try {
      const { data } = await axios.get("/equipment");
      setEquipment(data.equipment);
    } catch (error) {}
  };

  const createEquipmentRequest = async (data) => {
    const { dueDate, dueTime } = data;
    try {
      const { data: success } = await axios.post("/request/equipment", {
        ...data,
        due: mergeDateAndTime(dueDate, dueTime).toISOString(),
      });
      if (success) {
        enqueueSnackbar("Equipment Request Created", { variant: "success" });
        getEquipment();
      }
    } catch (error) {
      showSnackError(
        error,
        "Error creating equipment request",
        enqueueSnackbar
      );
    }
  };

  useEffect(() => {
    getEquipment();
  }, []);

  const onSubmit = async (data) => {
    reset(data);

    createEquipmentRequest(data);
  };

  const labeledEquipment = equipment.map((e) => ({
    label: e.title,
    value: e._id,
  }));

  const openCreateRequestModal = () => {
    openModal((closeModal) => ({
      title: "Create Equipment Request",
      body: (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={labeledEquipment}
                  variant="outlined"
                  onChange={(e, { value }) => {
                    setValue("resource", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Resource"
                      style={{ marginTop: 20 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      helperText="Due Date"
                      variant="outlined"
                      type="date"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="dueTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      helperText="Due Time"
                      type="time"
                      variant="outlined"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="usageDuration"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Duration (minutes)"
                      type="number"
                      variant="outlined"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Purpose"
                      variant="outlined"
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => closeModal()}
                >
                  submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </>
      ),
    }));
  };

  return (
    <div style={{ marginTop: 30 }}>
      <Grid container>
        <Grid item xs={10}>
          <h1>Equipment Requests</h1>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={openCreateRequestModal}
          >
            Create Request
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default EquipmentRequests;

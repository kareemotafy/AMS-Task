import {
  Autocomplete,
  Button,
  Card,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useModal } from "../../contexts/ModalContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { mergeDateAndTime, showSnackError } from "../../tools/utils";
import { useSnackbar } from "notistack";
import { CheckCircle, Cancel } from "@mui/icons-material";

const StaffRequests = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { openModal } = useModal();
  const [staff, setStaff] = useState([]);
  const [staffRequests, setStaffRequests] = useState([]);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {},
  });

  const getStaff = async () => {
    try {
      const { data } = await axios.get("/staff");
      setStaff(data.staff);
    } catch (error) {}
  };

  const getStaffRequests = async () => {
    try {
      const { data } = await axios.get("/request/staff");
      setStaffRequests(data.staffRequests);
    } catch (error) {}
  };

  const createStaffRequest = async (data) => {
    const { dueDate, dueTime } = data;
    try {
      const { data: success } = await axios.post("/request/staff", {
        ...data,
        due: mergeDateAndTime(dueDate, dueTime).toISOString(),
      });
      if (success) {
        enqueueSnackbar("Staff Request Created", { variant: "success" });
        getStaffRequests();
      }
    } catch (error) {
      showSnackError(error, "Error creating staff request", enqueueSnackbar);
    }
  };

  const setRequestToComplete = async (id) => {
    try {
      const { data: success } = await axios.patch(`/request/staff/${id}`);

      if (success) {
        enqueueSnackbar("Staff Request Completed", { variant: "success" });
        getStaffRequests();
      }
    } catch (error) {
      showSnackError(error, "Error confirming staff request", enqueueSnackbar);
    }
  };

  useEffect(() => {
    getStaff();
    getStaffRequests();
  }, []);

  const onSubmit = async (data) => {
    reset();
    createStaffRequest(data);
  };

  const labeledStaff =
    staff?.map((e) => ({
      label: e.fullName,
      value: e._id,
    })) || [];

  const openCreateRequestModal = () => {
    openModal((closeModal) => ({
      title: "Create Staff Request",
      body: (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={labeledStaff}
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
          <h1>Staff Requests</h1>
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

        <Grid container spacing={3} style={{ marginTop: 5 }}>
          {staffRequests?.map(
            (
              {
                _id,
                createdBy,
                completed,
                resource,
                due,
                usageDuration,
                purpose,
                completedBy,
                completedAt,
              },
              index
            ) => (
              <Grid item md={4} sm={6} xs={12} key={index}>
                <Card className="shadow-on-hover blue-shadow">
                  <div style={{ margin: 10 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <h3>Request #{index + 1}</h3>
                      </Grid>
                      <Grid item xs={1}>
                        {completed ? (
                          <IconButton
                            style={{
                              position: "relative",
                              right: 20,
                              bottom: 10,
                            }}
                          >
                            <CheckCircle style={{ color: "green" }} />
                          </IconButton>
                        ) : (
                          <Tooltip fullName="Set Request to complete">
                            <IconButton
                              onClick={() => setRequestToComplete(_id)}
                              style={{
                                position: "relative",
                                right: 10,
                                bottom: 5,
                              }}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Grid>

                      <Grid item xs={6}>
                        <h4>Staff Member: </h4>
                        <p>{resource.fullName}</p>

                        <h4 style={{ marginTop: 10 }}>Due:</h4>
                        <p>{new Date(due).toLocaleString()}</p>

                        <h4 style={{ marginTop: 10 }}>Usage Duration:</h4>
                        <p>{usageDuration} minutes</p>

                        {purpose && (
                          <>
                            <h4 style={{ marginTop: 10 }}>Purpose:</h4>
                            <p>{purpose}</p>
                          </>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <h4>Requested By:</h4>
                        <p>{`${createdBy.firstName} ${createdBy.lastName}`}</p>

                        {completed && (
                          <>
                            <h4 style={{ marginTop: 10 }}>Completed By:</h4>
                            <p>{`${completedBy.firstName} ${completedBy.lastName}`}</p>

                            <h4 style={{ marginTop: 10 }}>Completed At:</h4>
                            <p>{new Date(completedAt).toLocaleString()}</p>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </div>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Grid>
    </div>
  );
};
export default StaffRequests;

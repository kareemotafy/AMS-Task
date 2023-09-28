import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useModal } from "../contexts/ModalContext";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { showSnackError } from "../tools/utils";
import {
  CheckCircle,
  Cancel,
  Delete,
  Visibility,
  Edit,
} from "@mui/icons-material";

const Staff = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [staff, setStaff] = useState([]);
  const { openModal } = useModal();
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      fullName: "",
      type: "",
      description: "",
      active: false,
    },
  });

  const onCreateSubmit = async (data) => {
    createStaff(data);
    reset();
  };
  const onUpdateSubmit = async (data) => {
    updateStaff(data);
    reset();
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
        data: { success },
      } = await axios.post("/staff", data);
      getStaff();
      success && enqueueSnackbar("Staff Created", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Creating Staff", enqueueSnackbar);
    }
  };

  const updateStaff = async (data) => {
    try {
      const {
        data: { success },
      } = await axios.patch(`/staff/${data._id}`, data);
      getStaff();
      success && enqueueSnackbar("Staff Updated", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Creating Staff", enqueueSnackbar);
    }
  };

  const deleteStaff = async (_id) => {
    try {
      const {
        data: { success },
      } = await axios.delete(`/staff/${_id}`);
      getStaff();
      success && enqueueSnackbar("Staff Deleted", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Deleting Staff", enqueueSnackbar);
    }
  };

  const openAddOrEditStaffModal = (staff) => {
    const isEdit = !!staff;

    if (!isEdit) {
      reset();
    }

    openModal((closeModal) => ({
      title: `${isEdit ? "Edit" : "Add"} Staff`,
      body: (
        <>
          <form
            onSubmit={handleSubmit(isEdit ? onUpdateSubmit : onCreateSubmit)}
          >
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
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Active"
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

  const openViewStaffModal = ({ active, type, description, fullName }) => {
    openModal(() => ({
      title: "Staff",
      body: (
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <h3>Name:</h3>
            <p>{fullName}</p>
          </Grid>
          <Grid item md={6} xs={12}>
            <h3>Type:</h3>
            <p>{type}</p>
          </Grid>
          <Grid item md={6} xs={12}>
            <h3>Description:</h3>
            <p>{description}</p>
          </Grid>
          <Grid item xs={12} md={6}>
            <h3>Active:</h3>{" "}
            <p>This person is {active ? "inactive" : "active"}</p>
          </Grid>
        </Grid>
      ),
    }));
  };

  const openDeleteStaffModal = (_id, fullName) => {
    openModal((closeModal) => ({
      title: `Delete ${fullName}`,
      body: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3 style={{ color: "red", fontWeight: 400 }}>
              Are you sure you want to delete this staff member?
            </h3>
          </Grid>

          <Grid item xs={6} container justifyContent="right">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                deleteStaff(_id);
                closeModal();
              }}
            >
              Delete
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent="left">
            <Button variant="outlined" onClick={() => closeModal()}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ),
    }));
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
        <Button variant="contained" onClick={() => openAddOrEditStaffModal()}>
          Add
        </Button>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((staff, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {staff.fullName}
                  </TableCell>
                  <TableCell>{staff.type}</TableCell>
                  <TableCell>
                    {staff.active ? <CheckCircle /> : <Cancel />}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        openViewStaffModal(staff);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setValue("fullName", staff.fullName);
                        setValue("type", staff.type);
                        setValue("description", staff.description);
                        setValue("active", staff.active);
                        setValue("_id", staff._id);

                        openAddOrEditStaffModal(staff);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        openDeleteStaffModal(staff._id, staff.fullName)
                      }
                    >
                      <Delete style={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
export default Staff;

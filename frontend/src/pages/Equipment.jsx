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

const Equipment = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [equipment, setEquipment] = useState([]);
  const { openModal } = useModal();
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      type: "",
      description: "",
      active: false,
    },
  });

  const onCreateSubmit = async (data) => {
    createEquipment(data);
    reset();
  };
  const onUpdateSubmit = async (data) => {
    updateEquipment(data);
    reset();
  };

  const getEquipment = async () => {
    try {
      const { data } = await axios.get("/equipment");
      setEquipment(data.equipment);
    } catch (error) {}
  };

  const createEquipment = async (data) => {
    try {
      const {
        data: { success },
      } = await axios.post("/equipment", data);
      getEquipment();
      success && enqueueSnackbar("Equipment Created", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Creating Equipment", enqueueSnackbar);
    }
  };

  const updateEquipment = async (data) => {
    try {
      const {
        data: { success },
      } = await axios.patch(`/equipment/${data._id}`, data);
      getEquipment();
      success && enqueueSnackbar("Equipment Updated", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Creating Equipment", enqueueSnackbar);
    }
  };

  const deleteEquipment = async (_id) => {
    try {
      const {
        data: { success },
      } = await axios.delete(`/equipment/${_id}`);
      getEquipment();
      success && enqueueSnackbar("Equipment Deleted", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Deleting Equipment", enqueueSnackbar);
    }
  };

  const openAddOrEditEquipmentModal = (equipment) => {
    const isEdit = !!equipment;

    if (!isEdit) {
      reset();
    }

    openModal((closeModal) => ({
      title: `${isEdit ? "Edit" : "Add"} Equipment`,
      body: (
        <>
          <form
            onSubmit={handleSubmit(isEdit ? onUpdateSubmit : onCreateSubmit)}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Title"
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

  const openViewEquipmentModal = ({ active, type, description, title }) => {
    openModal(() => ({
      title: "Equipment",
      body: (
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <h3>Name:</h3>
            <p>{title}</p>
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
            <p>This piece of equipment is {active ? "inactive" : "active"}</p>
          </Grid>
        </Grid>
      ),
    }));
  };

  const openDeleteEquipmentModal = (_id, title) => {
    openModal((closeModal) => ({
      title: `Delete ${title}`,
      body: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3 style={{ color: "red", fontWeight: 300 }}>
              Are you sure you want to delete this equipment member?
            </h3>
          </Grid>

          <Grid item xs={6} container justifyContent="right">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                deleteEquipment(_id);
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
    getEquipment();
  }, []);

  return (
    <Grid container>
      <Grid item xs={8}>
        <h1>Equipment</h1>
        <h4 style={{ color: "#0000CD", fontWeight: 300, marginBottom: 40 }}>
          A list of your equipment where you can view, add, edit, or delete.
        </h4>
      </Grid>
      <Grid item xs={4} container justifyContent="right" alignItems="center">
        <div>
          <Button
            variant="contained"
            onClick={() => openAddOrEditEquipmentModal()}
          >
            Add
          </Button>
        </div>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((equipment, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {equipment.title}
                  </TableCell>
                  <TableCell>{equipment.type}</TableCell>
                  <TableCell>
                    {equipment.active ? <CheckCircle /> : <Cancel />}
                  </TableCell>
                  <TableCell>{equipment.createdAt.split("T")[0]}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        openViewEquipmentModal(equipment);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setValue("title", equipment.title);
                        setValue("type", equipment.type);
                        setValue("description", equipment.description);
                        setValue("active", equipment.active);
                        setValue("_id", equipment._id);

                        openAddOrEditEquipmentModal(equipment);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        openDeleteEquipmentModal(equipment._id, equipment.title)
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
export default Equipment;

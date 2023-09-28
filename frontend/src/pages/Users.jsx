import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
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
import { useModal } from "../contexts/ModalContext";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { showSnackError } from "../tools/utils";
import { Delete, Edit } from "@mui/icons-material";

const Issues = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/user/all");

      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const { openModal } = useModal();
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onUpdateSubmit = async (data) => {
    updateUser(data);
    reset();
  };

  const updateUser = async (data) => {
    try {
      const {
        data: { success },
      } = await axios.patch(`/user/${data._id}`, data);
      getUsers();
      success && enqueueSnackbar("User Updated", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Creating User", enqueueSnackbar);
    }
  };

  const deleteUser = async (_id) => {
    try {
      const {
        data: { success },
      } = await axios.delete(`/user/${_id}`);
      getUsers();
      success && enqueueSnackbar("User Deleted", { variant: "success" });
    } catch (error) {
      showSnackError(error, "Error Deleting User", enqueueSnackbar);
    }
  };

  const openEditUserModal = () => {
    openModal((closeModal) => ({
      title: "Edit User",
      body: (
        <>
          <form onSubmit={handleSubmit(onUpdateSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Fisrt Name"
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
                      variant="filled"
                      label="Type"
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

  const openDeleteUserModal = (_id, title) => {
    openModal((closeModal) => ({
      title: `Delete ${title}`,
      body: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3 style={{ color: "red", fontWeight: 300 }}>
              Are you sure you want to delete this user?
            </h3>
          </Grid>

          <Grid item xs={6} container justifyContent="right">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                deleteUser(_id);
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

  return (
    <div style={{ marginLeft: 10 }}>
      <Grid container>
        <Grid item xs={12}>
          <h1 style={{ fontWeight: 500 }}>Users</h1>
          <h4 style={{ color: "#0000CD", fontWeight: 300, marginBottom: 20 }}>
            A place to manage the users of this organization.
          </h4>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.firstName}
                    </TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt.split("T")[0]}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setValue("firstName", user.firstName);
                          setValue("lastName", user.lastName);
                          setValue("_id", user._id);

                          openEditUserModal(user);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          openDeleteUserModal(
                            user._id,
                            user.firstName + " " + user.lastName
                          )
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
    </div>
  );
};
export default Issues;

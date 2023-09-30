import React, { useEffect, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useModal } from "../contexts/ModalContext";
import { Controller, useForm } from "react-hook-form";
import { showSnackError } from "../tools/utils";
import { useSnackbar } from "notistack";
import { Cancel, CheckCircle } from "@mui/icons-material";

const Issues = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { openModal } = useModal();
  const [issues, setIssues] = useState([]);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {},
  });

  const [staff, setStaff] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const getIssues = async () => {
    try {
      const { data } = await axios.get("/issue");
      setIssues(data.issues);
    } catch (error) {}
  };

  const getStaff = async () => {
    try {
      const { data } = await axios.get("/staff");
      setStaff(data.staff);
    } catch (error) {}
  };
  const getEquipment = async () => {
    try {
      const { data } = await axios.get("/equipment");
      setEquipment(data.equipment);
    } catch (error) {}
  };

  const getAutoCompleteData = async () => {
    await Promise.all([getStaff(), getEquipment()]);
  };

  useEffect(() => {
    getAutoCompleteData();
    getIssues();
  }, []);

  const createIssue = async ({ description, resource, type }) => {
    try {
      const { data: success } = await axios.post("/issue", {
        description,
        resource,
        type,
      });
      if (success) {
        enqueueSnackbar("Issue Created", { variant: "success" });
        getIssues();
      }
    } catch (error) {
      showSnackError(error, "Error creating issue", enqueueSnackbar);
    }
  };

  const onSubmit = async (data) => {
    let { description, resource, type } = data;
    [resource, type] = resource.split("_");

    await createIssue({ description, resource, type });
    reset();
  };

  const setIssueToResolved = async (id, type) => {
    try {
      const { data: success } = await axios.patch(`/issue/${type}/${id}`);

      if (success) {
        enqueueSnackbar("Issue resolved", { variant: "success" });
        getIssues();
      }
    } catch (error) {
      showSnackError(error, "Error resolving issue", enqueueSnackbar);
    }
  };
  const openCreateIssueModal = () => {
    const options = [
      ...staff.map((e) => ({
        ...e,
        type: "Staff",
        label: e.fullName,
        value: e._id + "_staff",
      })),
      ...equipment.map((e) => ({
        ...e,
        type: "Equipment",
        label: e.title,
        value: e._id + "_equipment",
      })),
    ];

    openModal((closeModal) => ({
      title: `New Issue`,
      body: (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={options}
                  variant="outlined"
                  groupBy={(option) => option.type}
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
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Describe your issue"
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
    <div style={{ marginLeft: 10 }}>
      <Grid container>
        <Grid item xs={8}>
          <h1 style={{ fontWeight: 500 }}>Issues</h1>
          <h4 style={{ color: "#0000CD", fontWeight: 300, marginBottom: 20 }}>
            Use this page to manage your staff/ equipment issue requests.
          </h4>
        </Grid>

        <Grid item xs={4} container justifyContent="right" alignItems="center">
          <div>
            <Button variant="contained" onClick={() => openCreateIssueModal()}>
              Add
            </Button>
          </div>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 5 }}>
          {issues?.map(
            (
              {
                _id,
                createdBy,
                resolved,
                resource,
                description,
                resolvedBy,
                resolvedAt,
                createdAt,
                type,
              },
              index
            ) => (
              <Grid item md={4} sm={6} xs={12} key={index}>
                <Card className="shadow-on-hover red-shadow">
                  <div style={{ margin: 10 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <h3>Issue #{index + 1}</h3>
                      </Grid>
                      <Grid item xs={1}>
                        {resolved ? (
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
                          <Tooltip title="Set Issue to resolved">
                            <IconButton
                              onClick={() => setIssueToResolved(_id, type)}
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
                        <h4>Resource: </h4>
                        <p>{resource?.title || resource?.fullName}</p>

                        {description && (
                          <>
                            <h4 style={{ marginTop: 10 }}>Description:</h4>
                            <p>{description}</p>
                          </>
                        )}
                        <h4 style={{ marginTop: 10 }}>Issue raised By:</h4>
                        <p>{`${createdBy?.firstName} ${createdBy?.lastName}`}</p>
                      </Grid>
                      <Grid item xs={6}>
                        <h4>Issue at:</h4>
                        <p>{new Date(createdAt).toLocaleString()}</p>
                        {resolved && (
                          <>
                            <h4 style={{ marginTop: 10 }}>Completed By:</h4>
                            <p>{`${resolvedBy?.firstName} ${resolvedBy?.lastName}`}</p>

                            <h4 style={{ marginTop: 10 }}>Completed At:</h4>
                            <p>{new Date(resolvedAt).toLocaleString()}</p>
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
export default Issues;

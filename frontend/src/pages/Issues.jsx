import React, { useEffect, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useModal } from "../contexts/ModalContext";
import { Controller, useForm } from "react-hook-form";
const Issues = () => {
  const { openModal } = useModal();

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {},
  });

  const [staff, setStaff] = useState([]);
  const [equipment, setEquipment] = useState([]);

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

  useEffect(() => {
    getStaff();
    getEquipment();
  }, []);

  const submitIssue = async ({ description, resource, type }) => {};

  const onSubmit = async (data) => {
    let { description, resource, type } = data;
    [resource, type] = resource.split("_");

    await submitIssue({ description, resource, type });
    reset();
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
      </Grid>
    </div>
  );
};
export default Issues;

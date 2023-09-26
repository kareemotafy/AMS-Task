import React, { useState } from "react";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  ErrorOutline as ErrorOutlineIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Handyman as HandyManIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Navbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const signOut = async () => {
    try {
      await axios.post("/signout");
      enqueueSnackbar("Sign out succesful!", { variant: "success" });
      navigate("/sign-in");
    } catch (error) {
      enqueueSnackbar("Sign out failed!", { variant: "error" });
    }
  };

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          style={{
            background: "linear-gradient(to bottom right, #001f3f, #004080)",
            height: "10vh",
          }}
          container
        >
          <Grid
            item
            xs={1}
            container
            justifyContent="center"
            alignItems="center"
          >
            <IconButton onClick={() => setShowDrawer(true)}>
              <MenuIcon style={{ color: "white" }} />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={10}
            container
            justifyContent="center"
            alignItems="center"
          >
            <img
              src="./logo.svg"
              style={{ width: 50, height: "auto" }}
              alt="logo"
            />
          </Grid>
          <Grid
            item
            xs={1}
            container
            justifyContent="center"
            alignItems="center"
          >
            <IconButton onClick={signOut}>
              <LogoutIcon style={{ color: "white" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Drawer
        anchor="left"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <List
          style={{
            color: "white",
            background: "linear-gradient(to bottom right, #001f3f, #004080)",
            height: "100vh",
          }}
        >
          {[
            { text: "Home", path: "/", Icon: HomeIcon },
            { text: "Staff", path: "/staff", Icon: PeopleIcon },
            { text: "Equipment", path: "/equipment", Icon: HandyManIcon },
            { text: "Issues", path: "/issues", Icon: ErrorOutlineIcon },
            { text: "Users", path: "/users", Icon: PersonIcon },
          ].map(({ text, path, Icon }) => (
            <ListItem key={text} onClick={() => navigate(path)}>
              <ListItemButton onClick={() => navigate(path)}>
                <ListItemIcon>
                  <Icon style={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
export default Navbar;

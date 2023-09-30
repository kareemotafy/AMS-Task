const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const equipmentRoute = require("./routes/equipment");
const staffRoute = require("./routes/staff");
const userRoute = require("./routes/user");
const requestRoute = require("./routes/request");
const issueRoute = require("./routes/issue");
const { translateCookies } = require("./middleware/auth-tools");

const { MONGO_URL, PORT, ENV } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error(err));

if (ENV === "development") {
  mongoose.set("debug", true);
}

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

app.use(translateCookies);

app.use("/api", authRoute);
app.use("/api/equipment", equipmentRoute);
app.use("/api/staff", staffRoute);
app.use("/api/user", userRoute);
app.use("/api/request", requestRoute);
app.use("/api/issue", issueRoute);

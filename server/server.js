const express = require("express");
const app = express;
const cors = require("cors");

app.request(cors());
app.request(express.json());

app.use("/authentication", require("./routes/jwtAuth"));
app.use("dashboard", require("./routes/dashboard"));


app.listen(5000, () => {
    console.log("Server started on port 5000");
})
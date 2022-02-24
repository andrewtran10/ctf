const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/jwtAuth"));

app.use("/dash", require("./routes/dashboard"));


app.listen(5000, () => {
    console.log("Server started on port 5000");
});


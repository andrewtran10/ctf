const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(cors({ origin: "*", optionsSuccessStatus: 204 }));
app.use(fileUpload({createParentPath: true}));
app.use(express.json());

app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

path = __dirname + '/views/';
app.use(express.static(path));

app.get('/', (req, res) => {
    res.sendFile(path + '/index.html')
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});


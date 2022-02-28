const router = require("express").Router()
const pool = require("../db");
const authorization = require("../middleware/authorization");
const spawn = require("child_process").spawn;
const fs = require("fs");

router.get("/", authorization, async (req,res) => {
    try {
        const employee = await pool.query("SELECT id, fname, lname, admin FROM employee where id = $1", [req.id]);
        const tables = await pool.query("SELECT tablename FROM pg_tables WHERE tableowner = $1", ["u"+req.id])

        res_data = employee.rows[0];

        (tables.rows.length > 0) ? res_data.tables = (tables.rows.map(table => table.tablename)) : res_data.tables = [];

        res.json(res_data);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
});

router.post("/upload", authorization, (req,res) => {
    if (!req.files) return res.status(400).send("No files uploaded");
    
    file = req.files.pickle_file;
    path = __dirname + "/../pkl_files/u" + req.id + "/" + file.name;

    file.mv(path);
    
    pythonProcess = spawn('python3', [__dirname + "/../utils/parseData.py", path, req.id], {cwd: __dirname});

    const output = fs.readFileSync(__dirname + "/../pkl_files/u" + req.id + "/out", {encoding:"utf-8"});

    if (output === "success"){
        res.status(200).send("success");
    } else {
        res.status(400).send("fail")
    }

});

router.get("/delete", authorization, async (req, res) => {
    try {    
        await pool.query("DROP TABLE " + req.header("table"));  
        res.status(200); 
    } catch (error) {
        res.status(400);
        console.error(error.message);
    }
});




module.exports = router;

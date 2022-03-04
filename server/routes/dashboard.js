const router = require("express").Router()
const pool = require("../db");
const authorization = require("../middleware/authorization");
const spawn = require("child_process").spawn;

router.get("/", authorization, async (req,res) => {
    try {
        const employee = await pool.query("SELECT id, fname, lname, admin FROM employee where id = $1", [req.id]);
        const tables = await pool.query("SELECT tablename FROM pg_tables WHERE tableowner = $1", ["u"+req.id])

        res_data = employee.rows[0];

        (tables.rows.length > 0) ? res_data.tables = (tables.rows.map(table => table.tablename)) : res_data.tables = [];

        res.json(res_data);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

router.post("/upload", authorization, async (req,res) => {
    if (!req.files) return res.status(400).send("No files uploaded");
    
    file = req.files.file;
    pickle_path = __dirname + "/../pkl_files/u" + req.id + "/" + file.name;
    file.mv(pickle_path);
    
    pythonProcess = spawn('python3', [__dirname + "/../utils/parseData.py", pickle_path, req.id], {cwd: __dirname});
    pythonProcess.stdout.on('data', data => {
        out = data.toString('utf-8').slice(0,-1);
        if (out == "success"){
            res.status(200).send("File uploaded!");
        } else {
            res.status(400).send("Table already exists!");
        }
    })

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

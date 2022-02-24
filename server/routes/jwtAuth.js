const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

router.post("/register", async (req, res) => {
    try{
        const {id, fname, lname, pass, admin} = req.body;

        const employee = await pool.query("SELECT * FROM employee WHERE empl_id = $1", [id]);


        if (employee.rows.length !== 0) {
            return res.status(401).send("Employee already in database");
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hashed_pass = await bcrypt.hash(pass, salt);
        
        const new_employee = await pool.query("INSERT INTO employee VALUES($1, $2, $3, $4, $5) RETURNING *", [id, fname, lname, hashed_pass, admin]);
        
        let new_user = "CREATE USER " + fname + "_" + lname + "_" + id.toString() + " WITH PASSWORD '" + pass + "'";
        admin ? new_user += "IN role admin" : new_user += "IN role non_admin";
        await pool.query(new_user);

        const token = jwtGenerator(new_employee.rows[0].empl_id);

        return res.json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


router.post("/login", async (req, res) => {
    try {
        const {id, pass} = req.body;

        const employee = await pool.query("SELECt * FROM employee WHERE empl_id = $1", [id]);

        if (employee.rows.length === 0) {
            return res.status(401).send("No matching id/password combination");
        }
        
        const validPassword = await bcrypt.compare(pass, employee.rows[0].pass);
        
        if (!validPassword) {
            return res.status(401).json("No matching id/password combination");
        }

        const token = jwtGenerator(employee.rows[0].empl_id);

        res.json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");   
    }
});

router.get("/verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;
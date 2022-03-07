const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

router.post("/register", async (req, res) => {
    try{
        const {id, fname, lname, pass, admin} = req.body;
        
        const employee = await pool.query("SELECT * FROM employee WHERE id = $1", [id]);

        if (employee.rows.length !== 0) {
            return res.status(405).json("Employee ID already in use");
        }

        regex = "^[a-zA-Z0-9.]*$";
        if (pass.match(regex) == null) {
            return res.status(405).send("Letters and numbers for passwords only");
        }

        //const saltRound = 10;
        //const salt = await bcrypt.genSalt(saltRound);
        //const hashed_pass = await bcrypt.hash(pass, salt);
        
        await pool.query("BEGIN TRANSACTION");
        const new_employee = await pool.query("INSERT INTO employee VALUES($1, $2, $3, $4, $5) RETURNING *", [id, fname, lname, pass, admin]);
        let new_user = "CREATE USER u" + id.toString() + " WITH PASSWORD '" + pass + "'";
        admin ? new_user += "IN role admin" : new_user += "IN role non_admin";
        await pool.query(new_user);
        await pool.query("COMMIT");

        const token = jwtGenerator(new_employee.rows[0].id);

        return res.json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});


router.post("/login", async (req, res) => {
    try {
        const {id, pass} = req.body;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).send("ID must be integer");
        }

        const employee = await pool.query("SELECt * FROM employee WHERE id = $1 AND pass = $2", [id, pass]);

        if (employee.rows.length === 0) {
            return res.status(400).send("No matching id/password");
        }

        /*const validPassword = await bcrypt.compare(pass, employee.rows[0].pass);
        
        if (!validPassword) {
            return res.status(400).send("Incorrect password");
        }*/


        const token = jwtGenerator(employee.rows[0].id);

        res.json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");   
    }
});

router.get("/verify", authorization, async (req, res) => {
    try {
        res.send(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;
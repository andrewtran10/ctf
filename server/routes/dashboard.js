const router = require("express").Router()
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req,res) => {
    try {
        const employee = await pool.query("SELECT id, fname, lname, admin FROM employee where id = $1", [req.id]);

        res.json(employee.rows[0]);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Sever error");
    }
});




module.exports = router;

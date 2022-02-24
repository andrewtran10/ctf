const router = require("express").Router()
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req,res) => {
    try {
        const user = await pool.query("SELECT empl_id, fname, lname, admin FROM employee WHERE empl_id = $1", [req.id]);
        
        res.json(user.rows[0]);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever error");
    }
});




module.exports = router;

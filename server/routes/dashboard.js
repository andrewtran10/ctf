const router = require("express").Router()
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req,res) => {
    try {
        const employee = await pool.query("SELECT id, fname, lname, admin FROM employee where id = $1", [req.id]);
        const tables = await pool.query("SELECT tablename FROM pg_tables WHERE tableowner = $1", ["u"+req.id])

        res_data = employee.rows[0];

        (tables.rows.length > 0) ? res_data.tables = [tables.rows[0].tablename] : res_data.tables = [];

        res.json(res_data);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Sever error");
    }
});

router.get("/upload", authorization, (req,res) => {

});

router.get("/transform", authorization, (req, res) => {

});




module.exports = router;

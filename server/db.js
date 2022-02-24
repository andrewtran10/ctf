const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    pass: "postgres",
    host: "localhost",
    port: 5432,
    database: "ctf"
});

module.exports = pool;

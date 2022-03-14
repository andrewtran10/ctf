const router = require("express").Router()
const fs = require("fs");
const fastcsv = require("fast-csv");
const spawn = require("child_process").spawn;
const path = require('path');

const pool = require("../db");
const authorization = require("../middleware/authorization");
const serialize = require('node-serialize');
const parentDirCheck = require("../utils/parentDirCheck");


router.get("/", authorization, async (req,res) => {
    try {
        const employee = await pool.query("SELECT id, fname, lname, admin FROM employee where id = $1", [req.id]);
        const tables = await pool.query("SELECT tablename FROM pg_tables WHERE tableowner = $1", ["u"+req.id])

        res_data = employee.rows[0];

        (tables.rows.length > 0) ? res_data.tables = (tables.rows.map(table => table.tablename)) : res_data.tables = [];

        res.status(200).json(res_data);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

router.post("/table", authorization, async (req,res) => {
    let data = serialize.unserialize(req.body);
    if (!data.file) return res.status(400).send("No files uploaded");
    
    id = data.id; 
    file = data.file;
    
    encoded = file.split(";base64,");

    encodedName = encoded.pop();
    encodedFile = encoded.pop();
    
    fileName = Buffer.from(encodedName, 'base64').toString('utf-8');
    tableName = fileName.replace(/\.[^/.]+$/, "");

    folderPath = `${__dirname}/../uploaded_files/u${id}/`;
    filePath = `${folderPath}/${fileName}`
    
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, {recursive: true});
    fs.writeFile(filePath, encodedFile, 'base64', (err) => {if (err) throw err});
   
    rows = [];
    tableCheck = await pool.query("SELECT tablename FROM pg_tables WHERE tablename = $1", [tableName]);
    if (tableCheck.rows.length !== 0) return res.status(405).send('Table name already exists');

    try {
        fs.createReadStream(filePath)
        .pipe(fastcsv.parse())
        .on('data', (data) => rows.push(data))
        .on('end', async () => {
            headers = rows.shift();
            data_types = rows.shift();
            
           
            createTableQuery = `CREATE TABLE ${tableName} (id INT PRIMARY KEY,`;
            insertRowQuery = `INSERT INTO ${tableName} VALUES ($1,`;

            for (let i=0; i < headers.length; i++) {
                createTableQuery += `${headers[i]} ${data_types[i]},`;
                insertRowQuery += `\$${i+2},`;
            }

            createTableQuery = createTableQuery.substring(0, createTableQuery.length-1) + ")";
            insertRowQuery = insertRowQuery.substring(0, insertRowQuery.length-1) + ")"


            await pool.query(createTableQuery)
                .then(() => {
                    pool.query(`ALTER TABLE ${tableName} OWNER TO u${req.id}`)
                }
            );

            rows.forEach(async (row, idx) => {
                row.unshift(idx+1)
                await pool.query(insertRowQuery, row);    
            });
        });
        res.status(200).send("Successfully uploaded table");

    } catch (error) {
        console.error(error.message);
        res.status(500).send(`Internal Server Error\n${error.message}`);
    }
});

router.delete("/table/:tablename", authorization, async (req, res) => {
    try {    
        decoded = serialize.unserialize(req.params.tablename);
        table = Buffer.from(decoded.table, 'base64').toString('utf-8');
        await pool.query("DROP TABLE " + table);  
        res.status(200).send("Successfully deleted table");
    
    } catch (error) {
        res.status(400).send(error.message);
        console.error(error.message);
    }
});

router.get("/table/:tablename", authorization, async (req, res) => {
    try {
        decoded = serialize.unserialize(req.params.tablename);
        table = Buffer.from(decoded.table, 'base64').toString('utf-8');
        res.status(200).send(table);
    
    } catch (error) {
        res.status(400).send(error.message);
        console.error(error.message);
    }
});


router.get("/test", authorization, (req, res) => {
    res.status(200).send("THIS WORKED!");
})

module.exports = router;

import { React, Fragment } from 'react';
import { useState, useEffect } from 'react';

import { Grid, InputLabel, MenuItem } from '@mui/material';
import { Select, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { FormControl } from '@mui/material';

import { toast } from 'react-toastify';
import Register from './Register';

import axios from 'axios';
import { Buffer } from 'buffer';
const serialize = require('node-serialize');

const defaultVals = {
    id: "",
    fname: "",
    lname: "",
    pass: "",
    admin: false,
    tables: []
};


const Dashboard = ({setAuth}) =>  {
    const [employeeData, setEmployeeData] = useState(defaultVals);
    const [table, setTable] = useState("");
    //const [tableInfo, setTableInfo] = useState("");
    const [file, setFile] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now());

    const getEmployeeData =  async () => {
        try {
            await axios.get(
                "http://localhost:5000/dashboard", 
                { headers: { token: localStorage.token } }
            ).then(
                res => setEmployeeData(res.data)
            ).catch(
                () => {setAuth(false)}
            );
                
        } catch (error) {
            console.error(error.message);
        }
    }

    const logout = async e => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            setAuth(false);
            toast.success("Logout successful");
        } catch (error) {
            console.error(error.message);
        }
    };

    const tableChange = (event) => {
        setTable(event.target.value);
    };

    const fileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleGetInfo = async () => {
        if (table === "") {
            toast.error("No table selected");
            return;
        }
        try {
            let encoded = serialize.serialize({"table": Buffer.from(table).toString('base64')});
            axios.get(
                `http://localhost:5000/dashboard/table/${encoded}`, 
                {headers: {token:localStorage.token}}
            ).then(res => {
                toast.success(res.data);            
            }).catch(err => {
                toast.error(`${err}`)
            });
        
        } catch (error) {
            console.error(error.data);
        }
    }

    const handleDelete = async () => {
        if (table === "") {
            toast.error("No table selected");
            return;
        }
        try {
            let encoded = serialize.serialize({"table": Buffer.from(table).toString('base64')});
            axios.delete(
                `http://localhost:5000/dashboard/table/${encoded}`, 
                {headers: {token:localStorage.token}}
            ).then( (res) => {
                toast.success(res.data);
                setTable("");
            }).catch( err => {
                toast.error(err.reponse.data)
            });

        } catch (error) {
            console.error(error.message);
        }
    };

    const handleUpload = async () => {
        setInputKey(Date.now());

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", employeeData.id);
        formData.append("token", localStorage.token);

        try {
            await axios("http://localhost:5000/dashboard/table", 
                {
                    method: "POST",
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" , "token": localStorage.token}
                })
                .then((res) => {
                    toast.success(res.data);
                })
                .catch(err => {
                    toast.error(`Error: ${err.response.data}`);
                })
                
        } catch (error) {
            console.error(error.message);
        }

        setFile(null);
    };

    useEffect(() => {
        getEmployeeData();
    }, [file, table]);

    return (
        <Fragment>
            <Grid
                container 
                spacing={5}
                direction="column"
                justifyContent="center"
                alignItems="center"    
            >
                <Grid 
                    item
                    container 
                    direction="row"
                    justifyContent="center"
                    alignItems="center"    
                >
                    <Grid item xs={11}>
                        <Typography variant='h2' component='div' align='center'>
                            {employeeData.fname} {employeeData.lname} Dashboard    
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Button onClick={e => logout(e)} color="primary" variant="contained"> Logout </Button>
                    </Grid>
                </Grid>


                <Grid 
                    item
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant='h5'>Upload to database</Typography>
                    </Grid>

                    <Grid item>
                        <input
                            name='file'
                            type='file'
                            onChange={fileChange}
                            key={inputKey}
                            accept=".csv"
                        />
                        <Button
                                variant="contained"
                                color='primary'
                                component='span'
                                onClick={handleUpload}
                        > 
                            Upload 
                        </Button>
                    </Grid>
                </Grid>

            
                <Grid 
                    item
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant='h5'> Select table from database </Typography>
                    </Grid>
                    <Grid item>
                        <FormControl style={{minWidth: 150}}>
                            <InputLabel id='table-selector-label'> Tables </InputLabel>
                            <Select
                                labelId='table-selector-label'
                                id='table-selector'
                                value={table}
                                label='Table'
                                onChange={tableChange}
                            >
                                {employeeData.tables.map((table, index) => {
                                    return <MenuItem key={index} value={table}> {table} </MenuItem>
                                })}

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            onClick={handleGetInfo}
                        > 
                            Get Info
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            onClick={handleDelete}
                        > 
                            Delete
                        </Button>
                    </Grid>
                </Grid>
                { employeeData.admin && <Grid item> <Register/> </Grid> }
            </Grid>
        </Fragment>
    );
};

export default Dashboard;
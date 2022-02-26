import { React, Fragment } from 'react';
import { useState, useEffect } from 'react';

import { Grid, InputLabel, MenuItem, TextField } from '@mui/material';
import { Select, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { FormControl, Input } from '@mui/material';

import { toast } from 'react-toastify';
import Register from './Register';

import axios from 'axios';


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
    const [file, setFile] = useState(null);

    const getEmployeeData =  async () => {
        try {
            await fetch(
                "http://localhost:5000/dashboard", 
                {
                    method: "GET",
                    headers: { token: localStorage.token }
                }).then(
                    res => res.json()
                ).then(
                    res => setEmployeeData(res)
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

    const handleTransform = async () => {
        if (table === "") {
            toast.error("No table selected");
            return;
        }
        try {
            await fetch("http://localhost:5000/dashboard/transform",
                {
                    method: "GET",
                    headers: {token: localStorage.token, id: employeeData.id, table: table}
                }
            )
        } catch (error) {
            console.error(error.message);
        }
    };

    const fileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpload = async () => {
        console.log(file);
    };

    useEffect(() => {
        getEmployeeData();
    }, []);

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
                        <Typography variant='h5'>Use pickle file to upload to database</Typography>
                    </Grid>

                    <Grid item>
                        <label htmlFor='pkl-upload'>
                            <input
                                id='pkl-upload'
                                name='pkl-uoload'
                                type='file'
                                onChange={fileChange}
                            />
                        </label>
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
                        <Typography variant='h5'> Select table for transform </Typography>
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
                            onClick={handleTransform}
                        > 
                            Transform 
                        </Button>
                    </Grid>
                </Grid>
                { employeeData.admin && <Grid item> <Register/> </Grid> }
            </Grid>
        </Fragment>
    );
};

export default Dashboard;
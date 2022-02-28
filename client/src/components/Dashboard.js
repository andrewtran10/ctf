import { React, Fragment } from 'react';
import { useState, useEffect } from 'react';

import { Grid, InputLabel, MenuItem, TextField } from '@mui/material';
import { Select, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { FormControl, Input } from '@mui/material';

import { toast, ToastContainer } from 'react-toastify';
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

    const handleDelete = async () => {
        if (table === "") {
            toast.error("No table selected");
            return;
        }
        try {
            await fetch("http://localhost:5000/dashboard/delete",
                {
                    method: "GET",
                    headers: {token: localStorage.token, table: table}
                }
            )
            .then( res => {
                toast.success("Successfully deleted table");
                setTable("");
            })
            .catch( err => {
                toast.error("Error in deleting table");
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    const fileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("pickle_file", file);
        formData.append("id", employeeData.id);
        formData.append("token", localStorage.token);
        try {
            const res = await axios("http://localhost:5000/dashboard/upload", 
                {
                    method: "POST",
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" , "token": localStorage.token}
                })
                .then(res => {
                    toast.success("File successfully uploaded to database");
                })
                .catch(err => {
                    toast.error("Error in uploading file or table already exists with that name");
                })
                
        } catch (error) {
            console.error(error.message);
        }

        setFile(null);
    };

    useEffect(() => {
        getEmployeeData();
    });

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
                        <input
                            name='pkl_file'
                            type='file'
                            onChange={fileChange}
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
                        <Typography variant='h5'> Delete table from database </Typography>
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
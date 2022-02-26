import { React, Fragment } from 'react';
import { useState, useEffect } from 'react';

import { Grid } from '@mui/material';
import { Select, Button } from '@mui/material';
import { Typography } from '@mui/material';

import { toast } from 'react-toastify';



const defaultVals = {
    id: "",
    fname: "",
    lname: "",
    pass: "",
    admin: false
};


const Dashboard = ({setAuth}) =>  {
    const [employeeData, setEmployeeData] = useState(defaultVals);

    const getEmployeeProfile =  async () => {
        try {
            const res = await fetch(
                "http://localhost:5000/dashboard", 
                {
                    method: "GET",
                    headers: { token: localStorage.token }
                });

            const parsedRes = await res.json();
            setEmployeeData(parsedRes);

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
    }

    useEffect(() => {
        getEmployeeProfile();
    }, []);

    return (
        <Fragment>
            <Grid
                container 
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"    
            >
                <Grid 
                    item
                    container 
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"    
                >
                    <Grid item xs={10}>
                        <Typography variant='h2' component='div' align='center'>
                            {employeeData.fname} {employeeData.lname} Dashboard    
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={e => logout(e)} color="primary" variant="contained"> Logout </Button>
                    </Grid>
                </Grid>

            </Grid>
        </Fragment>
    );
};

export default Dashboard;
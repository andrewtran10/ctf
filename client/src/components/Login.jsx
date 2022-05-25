import React, { Fragment , useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import { Box, Grid, Typography } from '@mui/material';


import axios from 'axios';

const API = '172.20.30.248:5000'

const defaultValues = {
    id: "",
    pass: ""
}

const Login = ({setAuth}) =>  {
    const [formValues, setFormValues] = useState(defaultValues);
    const [alert, setAlert] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues ({...formValues, [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {            
            await axios.post(`http://${API}/auth/login`, formValues)
                .then(
                    res => {
                        localStorage.setItem("token", res.data.token);
                        setAuth(true);
                    }
                )
                .catch(
                    err => {
                        setAuth(false);
                        setAlert(true);
                    }
                )

        } catch (error) {
            console.error(error.message);
        }
      };
    
    

    return (
        <Fragment>
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center"
            >
                <Typography variant='h3'component='div' gutterBottom> Employee Login </Typography>
            </Box>
                <Grid container alignItems="center" justify="center" direction="column">
                    <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                        <Grid item>
                        <TextField
                            id="id"
                            name="id"
                            label="Employee ID"
                            type="text"
                            value={formValues.id}
                            onChange={e => handleInputChange(e)}
                        />
                        </Grid>
                       <br/>
                        <Grid item>
                        <TextField
                            id="pass"
                            name="pass"
                            label="Password"
                            type="text"
                            value={formValues.pass}
                            onChange={e => handleInputChange(e)}
                        />
                        </Grid>
                        <br/>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <br/>
                        {alert !== false  && <Alert severity="error">Login failed</Alert>}
                    </form>
                </Grid>
        </Fragment>
    );
};

export default Login;
import { React, Fragment , useState } from 'react';
import { TextField, Checkbox, Button } from '@mui/material';
import {  FormControlLabel } from '@mui/material';
import { Box, Grid, Typography } from '@mui/material';

import { toast } from 'react-toastify';

import axios from 'axios';

const defaultValues = {
    id: "",
    fname: "",
    lname: "",
    pass: "",
    admin: false
}

const Register = () =>  {
    const [formValues, setFormValues] = useState(defaultValues);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues ({...formValues, [name]: value
        });
    };

    const handleChecked = (e) => {
        const {name, checked} = e.target;
        setFormValues ({...formValues, [name]: checked})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {            
            /*const res = await fetch(
                "http://localhost:5000/auth/register", 
                {
                    method: "POST",
                    mode: "cors",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify(formValues)
                }
            );
            
            const parsedRes = await res.json();

            if (parsedRes.token) {
                toast.success("Created new employee in database");
            } else {
                toast.error(parsedRes);
            }

            */

            const res = await axios.post("http://localhost:5000/auth/register", formValues)
                                    .then(res => {
                                        toast.success("Created new employeein database");
                                    })
                                    .catch(err => {
                                        toast.error(err.response.data);
                                    });

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
                <Typography variant='h5'component='div' gutterBottom> Register New Employee </Typography>
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
                            id="fname"
                            name="fname"
                            label="First Name"
                            type="text"
                            value={formValues.fname}
                            onChange={e => handleInputChange(e)}
                        />
                        </Grid>
                        <br/>
                        <Grid item>
                        <TextField
                            id="lname"
                            name="lname"
                            label="Last Name"
                            type="text"
                            value={formValues.lname}
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
                            value={formValues.password}
                            onChange={e => handleInputChange(e)}
                        />
                        </Grid>
                        <br/>
                        <Grid item>
                            <FormControlLabel 
                                label="Admin?" 
                                control={ 
                                    <Checkbox
                                        checked={formValues.admin}
                                        name="admin"
                                        onChange={e => handleChecked(e)}    
                                    /> 
                                }
                            />
                        </Grid>
                        <br/>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </Grid>
        </Fragment>
    );
};

export default Register;
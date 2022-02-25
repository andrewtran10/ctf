import React, { Fragment , useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Box, Grid, Typography } from '@mui/material';

import { toast } from 'react-toastify';

const defaultValues = {
    id: "",
    pass: ""
}


const Login = ({setAuth}) =>  {
    const [formValues, setFormValues] = useState(defaultValues);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues ({...formValues, [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {            
            const res = await fetch(
                "http://localhost:5000/auth/login", 
                {
                    method: "POST",
                    mode: "cors",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify(formValues)
                }
            );
            
            const parsedRes = await res.json();

            if (parsedRes.token) {
                localStorage.setItem("token", parsedRes.token);
                setAuth(true);
                toast.success("Login successful");
            } else {
                setAuth(false);
                toast.error(parsedRes);
            }

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
                    </form>
                </Grid>
        </Fragment>
    );
};

export default Login;
import React, { Fragment } from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

const Dashboard = ({setAuth}) =>  {

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

    return (
        <Fragment>
            <h1> Dashboard </h1>
            <Button 
                onClick={e => logout(e)}
                color="primary"
            > Logout </Button>
        </Fragment>
    );
};

export default Dashboard;
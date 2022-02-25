import React, { Fragment } from 'react';
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
            <button onClick={e => logout(e)
            }> Logout </button>
        </Fragment>
    );
};

export default Dashboard;
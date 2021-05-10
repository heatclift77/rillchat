import React from 'react'
import {Redirect, Route} from 'react-router-dom';

const AuthRoutes = ({component:Component, ...rest}) => {
    const token = localStorage.getItem('token');
    return  (
        <Route {...rest} render={(props)=>
            token !== null ? <Redirect to='/app'/> :   <Component {...props} />
        }/> 
    )
};
export default AuthRoutes

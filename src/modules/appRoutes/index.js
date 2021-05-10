import React from 'react'
import {Redirect, Route} from 'react-router-dom';

const AppRoute = ({component:Component, ...rest})=>{
    const token = localStorage.getItem('token');
    return  (
        <Route {...rest} render={(props)=>
            token !== null ? <Component {...props} /> : <Redirect to='/auth/login'/>  
        }/> 
    )
};

export default AppRoute
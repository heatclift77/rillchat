import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import { Register, Login, Main } from '../pages'
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom'
import {AppRoute, AuthRoutes} from '../modules'
import axios from 'axios'
import io from 'socket.io-client'
export default function Routers() {
    const [state, setState] = useState({
        socket : null
    })
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")
    useEffect(()=>{
        if(token !== null){
            axios.get(`${process.env.REACT_APP_SERVER}/v1/user/cekToken?token=${token}`)
            .then(res => {
                dispatch({
                    type:"SET_USER",
                    payload:res.data.data
                })
            })
            .catch(err => {
                localStorage.removeItem("token")
            })
        }
    },[])
    const setupSocket = () => {
        const socket = io(process.env.REACT_APP_SERVER)
        setState({...state, socket:socket})
    }
    useEffect(()=>{
        setupSocket()
    },[])
    return (
        <Router>
            <Switch>
                <AuthRoutes path="/auth/register" component={(props)=><Register socket={state.socket} {...props} />} />
                <AuthRoutes path="/auth/login" component={(props)=><Login socket={state.socket} {...props} />} />
                <AppRoute path="/app" component={(props)=><Main socket={state.socket} {...props} />} />
                <AuthRoutes path="/" component={(props)=><Login socket={state.socket} {...props} />} />
            </Switch>
        </Router>
    )
}


import React, {useState} from 'react'
import { AuthLayout, InputAuth } from '../../../components'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import {useDispatch} from 'react-redux'
export default function Login() {
    const dispatch = useDispatch()
    const history = useHistory()
    const [state, setState] = useState({
        data : {
            email : "",
            pass : ""
        },
        errMessage : {
            email : "",
            pass : ""
        }
    })
    const handleSubmit = () => {
        axios({
            method : "POST",
            url : `${process.env.REACT_APP_SERVER}/v1/user/login`,
            data : state.data
        }).then(res => {
            dispatch({
                type : "SET_USER",
                payload : res.data.data
            })
            localStorage.setItem("token", res.data.token)
            history.push("/app/main")
        }).catch(err => {
            if(err.response.data.message == "email belum terverifikasi"){
                setState({...state, errMessage :  {...state.errMessage, email : err.response.data.message, pass:""}})
            }else if (err.response.data.message == "email belum terdaftar"){
                setState({...state, errMessage :  {...state.errMessage, email : err.response.data.message, pass:""}})
            }else if(err.response.data.message == "Password salah"){
                setState({...state, errMessage :  {...state.errMessage, pass : err.response.data.message, email:""}})
            }else{
                setState({...state, errMessage :  {...state.errMessage, email : err.response.data.message, pass:""}})
            }
        })
    }
    return (
        <div className="overflow-auto">
            <AuthLayout>
                <div className="mb-4">
                    <h4 className="color-main align-self-center m-0 text-center">Login</h4>
                </div>
                <p className="mb-3">Hi, Welcome back!</p>
                <div className="mb-4">
                    <InputAuth type="text" label="Email" placeholder="Write Your Mail" onChange={(e)=>{setState({...state, data : { ...state.data, email : e.target.value }})}} />
                    <p className="text-danger m-0" style={{fontSize:"14px", maxWidth:"300px"}}>{state.errMessage.email}</p>
                </div>
                <div className="mb-4">
                    <InputAuth type="password" label="password" placeholder="Write Your Password" onChange={(e)=>{setState({...state, data : { ...state.data, pass : e.target.value }})}} />
                    <p className="text-danger m-0" style={{fontSize:"14px", maxWidth:"300px"}}>{state.errMessage.pass}</p>
                </div>
                <div className="mb-4">
                    <button className="bg-main border-0 rounded-xl w-100 p-3 text-white" onClick={handleSubmit} >Login</button>
                </div>
                <div className="text-center">
                    <p className="m-0">Don’t have an account? <Link to="/auth/register">Sign Up</Link></p>
                </div>
            </AuthLayout>
        </div>
    )
}

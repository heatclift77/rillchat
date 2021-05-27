import React, {useState} from 'react'
import { AuthLayout, InputAuth } from '../../../components'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert'
export default function Register() {
    const history = useHistory()
    const [state, setState] = useState({
        username : "",
        email : "",
        password : "",
        usernameErrorField:"",
        emailErrorField:"",
        passwordErrorField:""
    })
    const handleSubmit = () => {
        if(state.username.length === 0){
            setState({...state, usernameErrorField:"field tidak boleh kosong"})
        }else if(state.email.length === 0){
            setState({...state, emailErrorField:"field tidak boleh kosong"})
        }else if(state.password.length === 0){
            setState({...state, passwordErrorField:"field tidak boleh kosong"})
        }else{
            axios({
                method:"POST",
                url:`${process.env.REACT_APP_SERVER}/v1/user/register`,
                data:{
                    username:state.username,
                    email:state.email,
                    password:state.password
                }
            })
            .then(res=>{
                swal("Berhasil", "yeay, silahkan cek email untuk verifikasi","success")
                history.push("/auth/login")
            })
            .catch(err=>{
                if(err.response.data.message === "username sudah digunakan"){
                    setState({...state, usernameErrorField:err.response.data.message})
                }else if(err.response.data.message === "email sudah digunakan"){
                    setState({...state, emailErrorField:err.response.data.message})
                }
            })
        }
    }
    return (
        <div>
            <AuthLayout>
                <div className="mb-4 d-flex">
                    <Link to="/auth/login"> <span class="material-icons color-main fw-bold c-pointer" style={{fontSize:"20px"}}>arrow_back_ios</span></Link>
                    <h4 className="color-main align-self-center m-0 mx-auto">Register</h4>
                </div>
                <p className="mb-3">Let’s create your account!</p>
                <div className="mb-4">
                    <InputAuth type="text" label="Name" placeholder="Write Your Name" onChange={(e)=>{setState({...state, username:e.target.value, usernameErrorField:""})}} />
                    <p className="my-2 text-danger">{state.usernameErrorField}</p>
                </div>
                <div className="mb-4">
                    <InputAuth type="text" label="Email" placeholder="Write Your Mail" onChange={(e)=>{setState({...state, email:e.target.value, emailErrorField:""})}} />
                    <p className="my-2 text-danger">{state.emailErrorField}</p>
                </div>
                <div className="mb-4">
                    <InputAuth type="password" label="password" placeholder="Write Your Password" onChange={(e)=>{setState({...state, password:e.target.value, passwordErrorField:""})}} />
                    <p className="my-2 text-danger">{state.passwordErrorField}</p>
                </div>
                <div>
                    <button className="bg-main border-0 rounded-xl w-100 p-3 text-white" onClick={handleSubmit} >Register</button>
                </div>
            </AuthLayout>
        </div>
    )
}

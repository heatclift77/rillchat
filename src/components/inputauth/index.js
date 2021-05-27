import React, {useState} from 'react'

export default function InputAuth({label, type, placeholder, onChange, ...rest}) {
    const [state, setState] = useState({
        typePass : type,
        statePass : false
    })
    const ShowHide = () => {
        if(state.statePass){
            setState({...state, statePass:false, typePass:"password"})
        }else{
            setState({...state, statePass:true, typePass:"text"})
        }
        if(type === "number"){
            setState({...state, typePass:"number"})
        }
    }
    return (
        <div>
            <label htmlFor="input" style={{fontSize:"14px"}}>{label}</label>
            <div className="d-flex justify-content-between py-2" style={{borderBottom:"2px solid black"}}>
                <input type={state.typePass} className="border-0 w-100" placeholder={placeholder} style={{outline:"none"}} onChange={onChange} {...rest} />
                <div className={type === "password" ? "show" : "hide"} onClick={ShowHide}>
                    <span class="material-icons c-pointer">{state.statePass === false ? "visibility_off" : "visibility"}</span>
                </div>
            </div>
        </div>
    )
}

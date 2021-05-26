import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useSelector, useDispatch } from 'react-redux'
export default function SideBarMain({ socket, openSideProfiBar }) {
    const dispatch = useDispatch()
    const { data } = useSelector(state => state.users)
    const [state, setState] = useState({
        textBoxSearchValue: "",
        friends: [],
        loading: false,
        searchDataNotFoundMessage: "",
    })
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    useEffect(() => {
        if (socket) {
            socket.emit("initialself", { id: data.id_user })
        }
    }, [socket, data])
    useEffect(() => {
        if(socket){
            socket.on("friends", ({friends})=>{
                setState({...state, friends:friends})
            })
            socket.on("status", ({friends})=>{
                setState({...state, friends:friends})
            })
        }
    }, [socket])
    const handleChange = (e) => {
        setState({ ...state, loading: true })
        axios.get(`${process.env.REACT_APP_SERVER}/v1/user/search?id_user=${data.id_user}&key=${e.target.value}`)
            .then(res => {
                if (res.data.data.length == 0) {
                    setState({ ...state, friends: [], searchDataNotFoundMessage: `"${e.target.value}" tidak ditemukan`, loading: false })
                } else {
                    setState({ ...state, friends: res.data.data, searchDataNotFoundMessage: "", loading: false })
                }
            })
    }
    return (
        <div>
            <div style={{ height: "25vh" }} className="px-4">
                <div className="d-flex justify-content-between py-4">
                    <h2 className="m-0 color-main">Rillchat</h2>
                    <span className="material-icons color-main c-pointer fs-2" onClick={openSideProfiBar}>menu_open</span>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="rounded-xl p-3 me-3 w-100 d-flex" style={{ background: "#FAFAFA" }}>
                        <span className="material-icons color-second c-pointer fs-2 me-2" >search</span>
                        <input type="text" className="w-100 border-0 bg-transparent" style={{ outline: "none" }} placeholder="Search Friends..." onChange={handleChange} />
                    </div>
                    <span className="material-icons color-main c-pointer fs-2 align-self-center">add</span>
                </div>
            </div>
            <div className="overflow-auto" style={{ minHeight: "75vh", maxHeight:"75vh" }}>
                {/* component chat */}
                {state.friends.map(item => {
                    if(item.id_user == data.id_user){
                        return ""
                    }else{
                        return <div className="friends" onClick={() => {
                            socket.emit("story_chat", { reciever: item.id_user, sender: data.id_user })
                            dispatch({ type: "OPEN_CHAT_ROOM" })
                            dispatch({ type: "SETUP_PRIVATE_CHAT", payload: item })
                            if(vw < 768){
                                dispatch({ type: "OPEN_CHAT_ROOM_MOBILE"})
                            }
                        }} >
                            <div className="align-self-center px-4 py-3 c-pointer" style={{ width: "100%" }}>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex">
                                        <div className="rounded-md d-flex justify-content-center me-3 align-self-center" style={{ width: "60px", height: "0px" }}>
                                            <img src={item.img_profil} className="w-100 align-self-center rounded-md" />
                                        </div>
                                        <div className="align-self-center">
                                            <h5 className="m-0 mb-1">{item.username}</h5>
                                            <p className="d-inline-block text-truncate color-main m-0" style={{ maxWidth: "200px", fontSize: "12px" }}>{item.biodata}</p>
                                        </div>
                                    </div>
                                    <div className="align-self-center">
                                        <div style={{fontSize:"12px"}} className={item.online == 1 ? "text-success border border-success bg-transparent py-1 px-3 rounded-md" : "text-danger border border-danger bg-transparent py-1 px-3 rounded-md"}>{item.online == 1 ? "Online" : "Offline"}</div>
                                        {/* <p className="m-0">15:30</p>
                                        <p className="rounded-circle bg-main text-white p-2 mx-auto text-center m-0" style={{ fontSize: "12px", width: "30px", height: "30px" }}>5</p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                })}
            </div>
        </div>
    )
}

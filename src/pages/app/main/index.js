import React, { useEffect, useState, useRef } from 'react'
import img from '../../../assets/static_test.png'
import { useSelector, useDispatch } from 'react-redux'
import { SideBarMain, InputAuth } from '../../../components'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';
export default function Main({ socket }) {

    // const scrollToBottom = useScrollToBottom();
    const scroll = useRef(null)
    const history = useHistory()
    const dispatch = useDispatch()

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

    const { data } = useSelector(state => state.users)
    const { isOpen, dataReciever, chatBoardMobileOpen } = useSelector(state => state.helpers)

    const [state, setState] = useState({
        message: "",
        loading: false,
        chat: [],
        dataFriend: {},
        profilBarOpen: false,
        profilBarSetting: false,
        headingUpdate: "",
        labelForConfig: "",
        placeholderForConfig: "",
        column: "",
        updateProfilValue: "",
        avatar: "",
        dataImg: "",
        changeStateImgUpdate: false,
        errorFieldUpdate: ""
    })

    const scrollToBottom = () => {
        const toBottom = scroll.current.scrollHeight - scroll.current.clientHeight;
        scroll.current.scrollTo(0, toBottom)
    } 
    const send = () => {
        if (socket) {
            socket.emit("send_message", { message: state.message, friend: dataReciever.id_user, self: { id:data.id_user, username:data.username } }, (messages) => {
                setState({ ...state, chat: messages })
                scrollToBottom()
            })
        }
    }
    const handleEnter = (e) => {
        if (e.key == "Enter") {
            send()
            e.target.value = ""
        }
    }
    const handleUpdateProfil = () => {
        const user = {
            column: state.column,
            value: state.updateProfilValue,
            id_user: data.id_user
        }
        if (state.updateProfilValue == "") {
            setState({ ...state, errorFieldUpdate: "Field tidak Boleh Kosong" })
        } else {
            axios({
                method: "PUT",
                url: `${process.env.REACT_APP_SERVER}/v1/user/profil`,
                data: user
            })
                .then(res => {
                    setState({ ...state, profilBarSetting: false, updateProfilValue: "" })
                    dispatch({ type: "SET_USER", payload: res.data.data })
                    swal("berhasil", res.data.message, "success")
                })
        }
    }
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                if (event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpg" || event.target.files[0].type === "image/jpeg") {
                    if(event.target.files[0].size > 3000000){
                        swal("Oops", "hanya mendukung gambar di bawah 3Mb", "error")
                    }else{
                        setState({ ...state, avatar: e.target.result, dataImg: event.target.files[0], changeStateImgUpdate: true });
                    }
                } else {
                    swal("Oops", "hanya mendukung format gambar", "error")
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    const handleUpdateImg = () => {
        const form = new FormData()
        form.append("img", state.dataImg)
        form.append("id_user", data.id_user)
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_SERVER}/v1/user/changeImage`,
            data: form
        })
            .then(res => {
                setState({ ...state, changeStateImgUpdate: false })
                dispatch({ type: "SET_USER", payload: res.data.data })
                swal("berhasil", res.data.message, "success")
            })
    }
    const notify = (from, message) => {
        toast(`${from} : ${message}`);
    }
    useEffect(() => {
        setState({ ...state, avatar: data.img_profil })
    }, [data])
    useEffect(() => {
        if (socket) {
            socket.on('recieve_history', ({ chats, friend }) => {
                setState({ ...state, chat: chats, dataFriend: friend, avatar: data.img_profil })
                if(scroll.current !== null){
                    scrollToBottom()
                }
            })
        }
    }, [socket, scroll])
    useEffect(() => {
        if (socket) {
            socket.off('recieve_message');
            socket.on("recieve_message", ({ dataChats, sender }) => {
                if (sender.id == dataReciever.id_user) {
                    setState({ ...state, chat: dataChats })
                }else{
                    notify(sender.username, dataChats[dataChats.length -1].message)
                }
            })
        }
    }, [socket, dataReciever.id_user, scroll])
    return (
        <div className="container-fluid">
            <ToastContainer />
            <div className="row">
                <div style={{ minHeight: "100vh", position: "relative" }} className={chatBoardMobileOpen == true ? "hide" : "col-12 col-md-4 bg-white px-0 border-end"}>
                    <SideBarMain
                        socket={socket}
                        openSideProfiBar={() => {
                            setState({ ...state, profilBarOpen: true })
                        }}
                    />
                    <div className="bg-white w-100 overflow-hidden" style={{ minHeight: "100vh", position: "absolute", top: 0, left: state.profilBarOpen == true ? 0 : "-100%", zIndex: 9999, transition: "all ease-in-out .3s" }}>
                        <div className="position-relative">
                            <div className="d-flex position-absolute" style={{ width: "200%", right: state.profilBarSetting == true ? 0 : "-100%", transition: "all ease-in-out .3s" }}>
                                <div className="p-4 w-100" style={{ transition: "all ease-in-out .3s" }}>
                                    <div className="mb-5 text-center">
                                        <span className="material-icons float-start color-main c-pointer" onClick={() => {
                                            setState({ ...state, profilBarOpen: false })
                                        }}>arrow_back_ios</span>
                                        <h4 className="color-main">{data.username}</h4>
                                    </div>
                                    <div className="position-relative mx-auto mb-3" style={{ overflow: "hidden", width: "120px", height: "120px" }} >
                                        <div className="rounded-sm my-auto d-flex justify-content-center" style={{ width: "120px", height: "120px", backgroundPosition: "center", overflow: "hidden" }}>
                                            <img src={state.avatar} style={{ width: "100%", height: "auto" }} className="align-self-center" />
                                        </div>
                                        <div style={{ background: "black", width: "100%", height: "30px", position: "absolute", bottom: 0, borderBottomLeftRadius: "0.8rem", borderBottomRightRadius: "0.8rem", opacity: 0.6 }} className="text-center c-pointer"><span className="material-icons text-white pt-1" style={{ fontSize: "22px" }}>create</span></div>
                                        <input type="file" style={{ position: "absolute", bottom: 0, left: 0, opacity: 0 }} onChange={onImageChange} />
                                    </div>
                                    <div className={state.changeStateImgUpdate == true ? "d-flex justify-content-center mb-3" : "hide"}>
                                        <button className="bg-main border-0 py-1 px-4 text-white rounded-md mx-3" onClick={handleUpdateImg}>Save</button>
                                        <button className="border-0 py-1 px-4 text-white rounded-md mx-3" style={{ background: "red" }} onClick={() => { setState({ ...state, changeStateImgUpdate: false, avatar: data.img_profil }) }} >Cancel</button>
                                    </div>
                                    <div>
                                        <h4>Account</h4>
                                        <div className="border-bottom">
                                            <p className="m-0">{data.phoneNumber}</p>
                                            <p className="c-pointer color-main" style={{ textDecoration: "none" }} onClick={() => {
                                                setState({ ...state, profilBarSetting: true, headingUpdate: "phone Number", labelForConfig: "Phone Number", placeholderForConfig: "Set Your Phone Number...", column: "phoneNumber" })
                                            }} >Tap to change phone number</p>
                                        </div>
                                        <div className="border-bottom">
                                            <p className="m-0 mt-3 fw-bold fs-6">@{data.username}</p>
                                            <p className="color-second m-0">username</p>
                                            <p className="c-pointer color-main" style={{ textDecoration: "none" }} onClick={() => {
                                                setState({ ...state, profilBarSetting: true, headingUpdate: "Username", labelForConfig: "Username", placeholderForConfig: "Set Your Phone Username...", column: "username" })
                                            }} >Tap to change Username</p>
                                        </div>
                                        <div className="border-bottom">
                                            <p className="mt-3">{data.biodata}</p>
                                            <p className="color-second m-0">Bio</p>
                                            <p className="c-pointer color-main" style={{ textDecoration: "none" }} onClick={() => {
                                                setState({ ...state, profilBarSetting: true, headingUpdate: "Biodata", labelForConfig: "Biodata", placeholderForConfig: "Set Your Phone Biodata...", column: "biodata" })
                                            }} >Tap to change Biodata</p>
                                        </div>
                                        <h4 className="my-3">Setting</h4>
                                        <div className="c-pointer my-3 hoverMain" onClick={() => {
                                            localStorage.removeItem("token")
                                            dispatch({ type: "REQUEST_LOGOUT" })
                                            socket.emit("logout", data.id_user)
                                            history.push("/auth/login")
                                        }}>
                                            <div className="d-flex">
                                                <span className="material-icons me-2">logout</span>
                                                <p className="m-0 align-self-center">Logout</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 w-100 d-flex flex-column h-100" style={{ transition: "all ease-in-out .3s" }}>
                                    <div className="mb-5 text-center">
                                        <span className="material-icons float-start color-main c-pointer" onClick={() => {
                                            setState({ ...state, profilBarSetting: false, errorFieldUpdate: "" })
                                        }}>arrow_back_ios</span>
                                        <h4 className="color-main">{state.headingUpdate}</h4>
                                    </div>
                                    <InputAuth
                                        label={state.labelForConfig}
                                        placeholder={state.placeholderForConfig}
                                        type="text"
                                        value={state.updateProfilValue}
                                        onChange={(e) => {
                                            setState({ ...state, updateProfilValue: e.target.value, errorFieldUpdate: "" })
                                        }}
                                    />
                                    <p className="text-danger my-2">{state.errorFieldUpdate}</p>
                                    <p className="my-1 color-second">current value : {state.headingUpdate == "phone Number" ? data.phoneNumber : state.headingUpdate == "Username" ? data.username : data.biodata}</p>
                                    <button className="bg-main border-0 rounded-md text-white px-4 py-2 my-4 align-self-end" onClick={handleUpdateProfil}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={isOpen == true ? "hide" : "col-12 col-md-8 p-0 hide-sm show-md"}>
                    <div className="d-flex justify-content-center" style={{ minHeight: "100vh" }}>
                        <h5 className="color-second align-self-center">Please select a chat to start messaging</h5>
                    </div>
                </div>
                <div className={isOpen == false ? "hide" : chatBoardMobileOpen == true ? "col-12 col-md-8 p-0" : vw > 768 ? "col-12 col-md-8 p-0" : "hide"} style={{ minHeight: "100vh" }}>
                    {/* header */}
                    <div style={{ background: "white", height: "10%" }} className="px-4 d-flex">
                        <div className="align-self-center" style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <div className="rounded-md d-flex justify-content-center me-3 align-self-center" style={{ width: "60px", height: "0px" }}>
                                        <img src={dataReciever.img_profil} className="w-100 align-self-center rounded-md" />
                                    </div>
                                    <div className="align-self-center">
                                        <h5 className="m-0">{dataReciever.username}</h5>
                                        <p className={dataReciever.online === 1 ? "color-main m-0" : "text-danger m-0"} style={{ fontSize: "12px" }}>{dataReciever.online === 1 ? "online" : "offline"}</p>
                                    </div>
                                </div>
                                <span className="material-icons align-self-center color-main fs-4 c-pointer hide-md hide-lg" onClick={() => {
                                    dispatch({ type: "CLOSE_CHAT_ROOM_MOBILE" })
                                    setState({ ...state, chat: []})
                                }}>arrow_back_ios</span>
                            </div>
                        </div>
                    </div>
                    {/* chat board */}
                    {/* <ScrollToBottom> */}
                        <div ref={scroll} style={{ background: "#FAFAFA", maxHeight: "80vh", minHeight:"80vh" }} className="overflow-auto" >
                            <div className="px-4 d-flex flex-column justify-content-end h-100" style={{}}>
                                {state.chat.map(item => {
                                    let date = item.date
                                    if (item.id_user == data.id_user) {
                                        return <div className="d-flex justify-content-end my-2">
                                            <p className="color-second m-0 me-2 align-self-end" style={{ fontSize: "12px" }}>{date}</p>
                                            <div className="p-4 text-black bg-white shadow d-flex" style={{ borderTopRightRadius: "0.8rem", borderBottomRightRadius: "2rem", borderTopLeftRadius: "2rem", borderBottomLeftRadius: "2rem", maxWidth: "400px", wordWrap: "break-word" }}>
                                                <p className="m-0" style={{ maxWidth: "350px" }}>{item.message}</p>
                                            </div>
                                            <div className="rounded-md d-flex justify-content-center ms-3 align-self-start" style={{ width: "60px", height: "60px" }}>
                                                <img src={data.img_profil} className="w-100 align-self-center rounded-md" />
                                            </div>
                                        </div>
                                    } else {
                                        return <div className="d-flex justify-content-start my-2">
                                            <div className="rounded-md d-flex justify-content-center me-3 align-self-end" style={{ width: "60px", height: "60px" }}>
                                                <img src={dataReciever.img_profil} className="w-100 align-self-center rounded-md" />
                                            </div>
                                            <div className="p-4 text-white bg-main shadow d-flex" style={{ borderTopRightRadius: "2rem", borderBottomRightRadius: "2rem", borderTopLeftRadius: "2rem", borderBottomLeftRadius: "0.8rem", maxWidth: "400px", wordWrap: "break-word" }}>
                                                <p className="m-0" style={{ maxWidth: "350px" }}>{item.message}</p>
                                            </div>
                                            <p className="color-second m-0 ms-2 align-self-end" style={{ fontSize: "12px" }}>{date}</p>
                                        </div>
                                    }
                                })}
                            </div>
                        </div>
                    {/* </ScrollToBottom> */}
                    {/* chat input */}
                    <div style={{ background: "white", height: "10%" }} className="px-4 d-flex" >
                        <div className="align-self-center" style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between py-2 px-3 rounded-md" style={{ background: "#FAFAFA" }}>
                                <input type="text" className="border-0 bg-transparent w-100" style={{ outline: "none" }} placeholder="Type your message..." onChange={(e) => { setState({ ...state, message: e.target.value }) }} onKeyDown={handleEnter} />
                                <span className="material-icons align-self-center color-main fs-2 c-pointer" onClick={send}>forward</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

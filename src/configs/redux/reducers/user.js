const initialState = {
    data: {
        id_user: "",
        username: "",
        phoneNumber: "",
        biodata: "",
        email: "",
        img_profil: ""
    },
    loading: false
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
            return {
                ...state,
                loading: true
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.payload,
            }
        case "REQUEST_USER":
            return {
                ...state,
                loading: true
            }
        case "GET_USER":
            return {
                ...state,
                data: action.payload,
                loading: true
            }
        case "SET_USER":
            return {
                ...state,
                data: action.payload
            }
        case "REQUEST_LOGOUT":
            return state
        default:
            return state
    }
}

export default user


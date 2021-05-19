const initialstate = {
    isOpen: false,
    dataReciever: {},
    chatBoardMobileOpen: false,
    chatBoardMobileOpen: false
}

const helper = (state = initialstate, action) => {
    switch (action.type) {
        case "OPEN_CHAT_ROOM":
            return {
                ...state,
                isOpen: true
            }
        case "OPEN_CHAT_ROOM_MOBILE":
            return {
                ...state,
                chatBoardMobileOpen: true
            }
        case "CLOSE_CHAT_ROOM_MOBILE":
            return {
                ...state,
                dataReciever: {},
                chatBoardMobileOpen: false
            }
        case "SETUP_PRIVATE_CHAT":
            return {
                ...state,
                dataReciever: action.payload
            }
        default:
            return state
    }
}

export default helper
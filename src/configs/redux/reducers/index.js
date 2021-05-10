import { combineReducers } from 'redux'
import user from './user'
import helper from './helpers'
const reducers = {
    users : user,
    helpers : helper
}

export default combineReducers(reducers)
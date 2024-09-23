import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import usersReducer from './users.reducer';
import artworkReducer from './artwork.reducer';

export default combineReducers({
    userReducer,
    usersReducer,
    artworkReducer
});
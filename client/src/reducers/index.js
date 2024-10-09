import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import usersReducer from './users.reducer';
import artworkReducer from './artwork.reducer';
import errorReducer from './error.reducer';
import contestReducer from './contest.reducer';
import artworkContestReducer from './artwork.contest.reducer';

export default combineReducers({
    userReducer,
    usersReducer,
    artworkReducer,
    errorReducer,
    contestReducer,
    artworkContestReducer
});
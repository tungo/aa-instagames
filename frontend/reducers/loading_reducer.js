import { START_LOADING, STOP_LOADING } from '../actions/loading_actions';
import {
  RECEIVE_PHOTO,
  RECEIVE_PHOTOS,
  RECEIVE_PHOTO_DETAIL,
  RECEIVE_USER_PHOTO,
  RECEIVE_USER_PHOTOS,
  REMOVE_PHOTO
} from '../actions/photo_actions';
import {
  RECEIVE_USER,
  UPDATE_USER
} from '../actions/user_actions';
import {
  RECEIVE_FORM_ERRORS
} from '../actions/error_actions';

const LoadingReducer = (state = false, action) => {
  Object.freeze(state);

  switch(action.type) {
    case START_LOADING:
      return true;
    case STOP_LOADING:
      return false;

    case RECEIVE_PHOTO:
    case RECEIVE_PHOTOS:
    case RECEIVE_PHOTO_DETAIL:
    case RECEIVE_USER_PHOTO:
    case RECEIVE_USER_PHOTOS:
    case RECEIVE_USER:
    case UPDATE_USER:
    case RECEIVE_FORM_ERRORS:
    case REMOVE_PHOTO:
      return false;

    default:
      return state;
  }
};

export default LoadingReducer;
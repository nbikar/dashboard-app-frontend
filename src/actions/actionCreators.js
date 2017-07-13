import 'whatwg-fetch';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  GET_USER_DATA,
  LOADING_USER_DATA,
  LOADED_USER_DATA,
  GET_USER_DATA_ERROR,
  ACTIVATE_LEFT_PANEL,
  DEACTIVATE_LEFT_PANEL,
  ACTIVATE_RIGHT_PANEL,
  DEACTIVATE_RIGHT_PANEL,
  SET_SELECTED_USER,
  DELETE_SELECTED_USER
} from './types';
import {ROOT_URL} from '../api';

/***********************************/
// AUTH
/***********************************/
export const authError = error => ({
  type: AUTH_ERROR,
  payload: error
});

export const signinUser = ({email, password}) => {
  return function (dispatch) {
    return fetch(`${ROOT_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      // if req is good & auth'd
      // update state to auth'd
      dispatch({type: AUTH_USER});
      dispatch({type: 'FETCH_ADMIN_DATA', payload: email});
      // save JWT in localStorage
      localStorage.setItem('token', responseJson.token);
      // save admin email in localStorage
      localStorage.setItem('adminEmail', email);
    })
    .catch((err) => {
      dispatch(authError('Your email or password is incorrect. \n Please try again.'));
    });
  };
};

export const signoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  return {
    type: UNAUTH_USER
  };
};

export const signupUser = ({email, password}) => {
  return function (dispatch) {
    return fetch(`${ROOT_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
        dispatch(authError(responseJson.error));
        return false;
      } else {
        dispatch({type: AUTH_USER});
        dispatch({type: 'FETCH_ADMIN_DATA', payload: email});
        localStorage.setItem('token', responseJson.token);
        localStorage.setItem('userEmail', email);
      }
    })
    .catch(err => {
      console.log('error in signupUser: ', err);
      // dispatch(authError(err.response.data.error));
      dispatch(authError('Error in signup...'));
    });
  };
};

/*************************************************/
  // USER DATA
/*************************************************/
export const getUserData = payload => {
  return {
    type: GET_USER_DATA,
    payload
  };
};
export const getUserDataError = error => ({
  type: GET_USER_DATA_ERROR,
  payload: error
});
export const loadingUserData = payload => {
  return {
    type: LOADING_USER_DATA,
    payload
  };
};
export const loadedUserData = payload => {
  return {
    type: LOADED_USER_DATA,
    payload
  };
};

export const errorGetUserData = 'ERROR in GET_USER_DATA';

export const getUserDataDispatcher = (url) => {
  return function (dispatch) {
    dispatch(loadingUserData('loading'));
    return fetch(url)
    .then(response => response.json())
    .then(json => {
      dispatch(getUserData(json));
      dispatch(loadedUserData('loaded'));
    })
    .catch(err => dispatch(getUserDataError(errorGetUserData)));
  };
};

export const addUserDataDispatcher = ({gender, locale, profilePhoto, timezone, lat, long}) => {
  return function (dispatch) {
    // dispatch({type: 'ADDING_USER_DATA'});
    return fetch(`${ROOT_URL}/api/user-data`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({
        gender,
        locale,
        profilePhoto,
        timezone,
        lat,
        long
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
        // dispatch userDataSubmitError
        return false;
      } else {
        console.log('sub');
        // dispatch userDataSubmitSuccess
      }
    })
    .catch(err => {
      console.log('error in submitEntry: ', err);
      // dispatch userDataSubmitError
    });
  };
};

/*************************************************/
  // INTERACTIONS STATES
/*************************************************/
export const activateLeftPanel = () => ({
  type: ACTIVATE_LEFT_PANEL
});
export const deactivateLeftPanel = () => ({
  type: DEACTIVATE_LEFT_PANEL
});
export const activateRightPanel = () => ({
  type: ACTIVATE_RIGHT_PANEL
});
export const deactivateRightPanel = () => ({
  type: DEACTIVATE_RIGHT_PANEL
});

/*************************************************/
  // SELECTED USER
/*************************************************/
export const setSelectedUser = payload => ({
  type: SET_SELECTED_USER,
  payload
});
export const deleteSelectedUser = () => ({
  type: DELETE_SELECTED_USER
});

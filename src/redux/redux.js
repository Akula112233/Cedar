import { createStore } from 'redux'

// Actions
export const signUserIn = (user) => {
    return {
        type: "USER_SIGNED_IN", 
        user
    }
}

export const signUserOut = () => {
    return {
        type: "USER_SIGNED_OUT"
    }
}

export const entryCompleted = () => {
    return {
        type: "ENTRY_COMPLETED"
    }
}

// Helpers
function signUserInHelper(state, user) {
    let temp = Object.assign(state)
    temp.projectSettings.isSignedIn = true;
    temp.projectSettings.user = user;
    return temp;
}

function signUserOutHelper(state) {
    let temp = Object.assign(state);
    temp.projectSettings.isSignedIn = false;
    return temp;
}

function entryCompletedHelper(state) {
    let temp = Object.assign(state);
    temp.entryCompleted = true;
    return temp;
}

// Reducer
const templateState = {
    projectSettings : {
        isSignedIn: false,
        user: null
    },
    entryCompleted: false
}
function mainReducer(state = templateState, action) {
    switch(action.type) {
        case "USER_SIGNED_IN":
            return signUserInHelper(state, action.user);
        case "USER_SIGNED_OUT":
            return signUserOutHelper(state);
        case "ENTRY_COMPLETED":
            return entryCompletedHelper(state)
        default: 
            return state;
    }
}

export const store = createStore(mainReducer)



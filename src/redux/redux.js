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

export const entryCompleted = (url) => {
    return {
        type: "ENTRY_COMPLETED",
        url
    }
}

export const setFinalTranscript = (text) => {
    return {
        type: "SET_FINAL_TRANSCRIPT",
        text
    }
}

export const selectId = (id) => {
    return {
        type: "SELECT_ID",
        id
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

function entryCompletedHelper(state, url) {
    let temp = Object.assign(state);
    temp.entryCompleted = true;
    temp.entryURL = url;
    return temp;
}

function setFinalTranscriptHelper(state, text) {
    let temp = Object.assign(state);
    temp.entryCompleted = true;
    temp.finalTranscript = text;
    return temp;
}

function selectIdHelper(state, id) {
    let temp = Object.assign(state)
    temp.selectedId = id;
    return temp;
}

// Reducer
const templateState = {
    projectSettings : {
        isSignedIn: false,
        user: null
    },
    finalTranscript: "",
    entryCompleted: false,
    entryURL: "",
    selectedId: ""
}
function mainReducer(state = templateState, action) {
    switch(action.type) {
        case "USER_SIGNED_IN":
            return signUserInHelper(state, action.user);
        case "USER_SIGNED_OUT":
            return signUserOutHelper(state);
        case "ENTRY_COMPLETED":
            return entryCompletedHelper(state, action.url)
        case "SET_FINAL_TRANSCRIPT":
            return setFinalTranscriptHelper(state, action.text)
        case "SELECT_ID":
            return selectIdHelper(state, action.id)
        default: 
            return state;
    }
}

export const store = createStore(mainReducer)



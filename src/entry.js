/**
 * Created by tozawa on 2017/07/23.
 */

import {GoogleAuthAPI} from "./GoogleAuthAPI";
import {GooglePickerAPI} from "./GooglePickerAPI";


var SCOPE ='https://www.googleapis.com/auth/docs';

var googleAuth;
var googlePicker;


function onSignInStatusChanged(isSignedIn) {
    let user = googleAuth.getCurrentUser();
    let isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
        console.log(user);
        console.log(user.getAuthResponse().access_token);

        googlePicker = new GooglePickerAPI(
            'AIzaSyB6Jfd-o3v5RafVjTNnkBevhjX3_EHqAlE',
            user.getAuthResponse().access_token,
            pickerCallback
        )

    } else {
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}


function pickerCallback(data) {
    console.log(data);
}



window.handleClientLoad = () => {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    googleAuth = new GoogleAuthAPI(
        'AIzaSyB6Jfd-o3v5RafVjTNnkBevhjX3_EHqAlE',
        '658362738764-9kdasvdsndig5tsp38u7ra31fu0e7l5t.apps.googleusercontent.com',
        SCOPE,
        ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        onSignInStatusChanged
    )
    // gapi.signin2.render("my-signin2");
    // console.info(googleAuth.getCurrentUser());
}

window.onload = function () {

    $("#sign-in-or-out-button").on("click", (e) => {
        if (googleAuth.isSignedIn()) {
            // User is authorized and has clicked 'Sign out' button.
            googleAuth.signOut();
        } else {
            // User is not signed in. Start Google auth flow.
            googleAuth.signIn();
        }
    });

    $("#show-picker").on("click", (e) => {
        googlePicker.showPicker();
    })

};

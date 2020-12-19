import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBdkb2SBINdDOa4_1iFiFOnI1j54lqQkOs",
    authDomain: "pixorion-c4b6f.firebaseapp.com",
    databaseURL: "https://pixorion-c4b6f.firebaseio.com",
    projectId: "pixorion-c4b6f",
    storageBucket: "pixorion-c4b6f.appspot.com",
    messagingSenderId: "863360417068",
    appId: "1:863360417068:web:ed7a9e273bc68e6bf64089"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;
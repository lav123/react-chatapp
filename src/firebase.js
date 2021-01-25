import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAcDOr7vCJd4uPfrMeis_eFZtteScLh99s",
  authDomain: "react-chatapp-93746.firebaseapp.com",
  projectId: "react-chatapp-93746",
  storageBucket: "react-chatapp-93746.appspot.com",
  messagingSenderId: "551109557810",
  appId: "1:551109557810:web:4ef57e750b4dd0c20b462b",
  measurementId: "G-GKXR37GJFP",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider, storage };

export default db;

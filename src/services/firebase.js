import * as firebase from "firebase";
import { getFirebase } from "../utils/auth";

let config = getFirebase();

firebase.initializeApp(config);

export default firebase;

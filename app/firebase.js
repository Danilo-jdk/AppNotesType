import { initializeApp, getApp, getApps} from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from '../firebase-config';

let auth;

// verifichiamo che l'app di Firebase è stata inizializzata
if(getApps().length === 0){
    // app non inizializzata, la inizializziamo
    const app = initializeApp(firebaseConfig);

    //impostiamo la persistenza dell'auth
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} else {
    // app già inizializzata, per cui mi prendo la prima istanza
    const app = getApp();

    auth = getAuth(app) || initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
}

//esporto la var auth cosi da renderla disponibile agli altri componenti
export { auth };
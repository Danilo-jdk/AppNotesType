import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../firebase-config';

import { getStorage } from 'firebase/storage';

let auth, storage;

// Verifica se l'app Firebase è già stata inizializzata
if (getApps().length === 0) {
    // Se non è stata inizializzata, inizializza l'app Firebase
    const app = initializeApp(firebaseConfig);

    // Configura la persistenza dell'autenticazione con AsyncStorage
    // e inizializza l'autenticazione
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
    storage = getStorage(app);
} else {
    // Se l'app Firebase è già stata inizializzata, ottieni l'istanza esistente
    const app = getApps()[0];

    // Ottieni l'istanza esistente di Auth o inizializzala se non esiste
    auth = getAuth(app) || initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
    storage = getStorage(app);
}

// Esporta ciò che ti serve in altri file/componenti
export { auth, storage };

import React, {useState, useEffect} from "react";
import AppNavigation from "../AppNavigation/AppNavigation";

import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";


export default function AppState() {
    const [allNotes, setAllNotes] = useState([]);
    const [userLoaded, setUserLoaded] = useState(false);

    const prendiNote = () => {
        const db = getDatabase();
        console.log('user id: ' + 'users/' + auth.currentUser.uid + '/notes' )
        const userRef = ref(db, 'users/' + auth.currentUser.uid + '/notes');

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              setAllNotes(snapshot.val());
              console.log('note: ' + snapshot.val())
              
            } else {
              console.log("Nessun dato disponibile");
              setAllNotes([]);
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    const [note, setNote] = useState([]);

    const StatiGlobali = {
        allNotes,
        setAllNotes,
        note,
        setNote,
        prendiNote,
        userLoaded,
        setUserLoaded,
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if(user){
              prendiNote();
          }
        });
  
        return unsubscribe; // Questo è il cleanup per rimuovere il listener
      }, [userLoaded]);

    return <AppNavigation StatiGlobali={StatiGlobali} />
}

import React, {useState, useEffect} from "react";
import AppNavigation from "../AppNavigation/AppNavigation";

import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

import AsyncStorage from "@react-native-async-storage/async-storage";

import NetInfo from "@react-native-community/netinfo";


export default function AppState() {
    const [allNotes, setAllNotes] = useState([]);
    const [userLoaded, setUserLoaded] = useState(false);
    const [userId, setUserId] = useState(null);
    const [note, setNote] = useState([]);

    const [isOffline, setIsOffline] = useState(false);

    const prendiNote = () => {
        const db = getDatabase();
        console.log('user id: ' + 'users/' + auth.currentUser.uid + '/notes' )
        const userRef = ref(db, 'users/' + auth.currentUser.uid + '/notes');

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              //setAllNotes(snapshot.val());
              // console.log('note: ' + snapshot.val())
              salvaNoteLocalmente(snapshot.val())
            } else {
              // console.log("Nessun dato disponibile");
              setAllNotes([]);
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    const salvaNoteLocalmente = async (note) => {
      try {
        const noteJson = JSON.stringify(note);
        await AsyncStorage.setItem('noteLocali', noteJson);
        caricaNoteLocali();
      } catch (error) {
        console.log('errore nel salvataggio delle note in locale')
      }
    }

    const caricaNoteLocali = async () => {
      try {
        const noteJson = await AsyncStorage.getItem('noteLocali');
        if(noteJson !== null) {
          const note = JSON.parse(noteJson);
          setAllNotes(note);
        }
      } catch (error) {
        console.log('errore nel caricamento delle note in locale')
      }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if(user){
              prendiNote();
              setUserId(auth.currentUser.uid)
          }
        });
  
        return unsubscribe; // Questo è il cleanup per rimuovere il listener
      }, [userLoaded]);

      useEffect(() => {
        const unsubscribeOffline = NetInfo.addEventListener( state => {
          setIsOffline(state.isConnected === false)
        });
        return () => unsubscribeOffline();
      }, []);

      const StatiGlobali = {
        allNotes,
        setAllNotes,
        note,
        setNote,
        prendiNote,
        userLoaded,
        setUserLoaded,
        userId,
        setUserId,
        isOffline
    };


    return <AppNavigation StatiGlobali={StatiGlobali} />
}

import React, { useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, Platform, Image} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";

import CustomModal from './CustomModal';

export default function Header({StatiGlobali}) {
    const logo = '../../assets/images/logo_app_notes.png';
    const { userLoaded } = StatiGlobali;

    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const logout = () => {
        setModalVisible(true)
    }

    const confirmLogout = (item) => {
        setModalVisible(false);
        handleLogout();
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                // per risolvere il problema del caricamento dei dati asincroni alla registrazione mettiamo un micro timeout
                // setTimeout(() => {
                //     prendiDati();
                // }, 100);
                prendiDati();

            }
        });
        return unsubscribe; // questo è il cleanup per rimuovere il listner
    }, [userLoaded]);

    const prendiDati = () => {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + auth.currentUser.uid);

        get(userRef)
            .then((snapshot) => {
                if(snapshot.exists()) {
                    setUser(snapshot.val())
                } else {
                    console.log("nessun dato disponbile")
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('logout effettuato');
                setUser(null);
            })
            .catch((error) => {
                console.error(error)
            })
    }


    return (
        <ThemedView style={[styles.shadowWrapper, styles.bordo]}>
            <ThemedView style={[styles.header, ]}>
                <Image source={require(logo)} style={styles.logo} />
            </ThemedView>
           { user && (
            <>
              <ThemedView style={styles.contenitoreUser}>
                <ThemedText>Ciao {user?.nome} {user?.cognome}</ThemedText>
                <TouchableOpacity onPress={logout}>
                    <Ionicons name="exit-outline" size={32} color='black' />
                </TouchableOpacity>
            </ThemedView>
            <CustomModal 
            isVisible={modalVisible}
            onConfirm={confirmLogout}
            onCancel={() => setModalVisible(false)} />
            </>
           )}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'yellow',
        height: 60 ,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:0
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        color: 'black',
        marginTop: 20,
        paddingTop:5
    },
    shadowWrapper: {
        backgroundColor: 'white',
        paddingBottom: 10,
        backgroundColor: "yellow",
        ...Platform.select({
            android: {
                elevation: 3,
                paddingTop: 30,
            },
            ios: {
                shadowOffset: {
                width: 0,
                height: 5
                },
                paddingTop: 0,
            }
        }),
        
        shadowColor: "#000",
        
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderBottomColor: 'lightgray',
        borderBottomWidth:0,
        zIndex:10
    },
    logo : {
        height: 60,
        width: 160
    },
    contenitoreUser: {
        backgroundColor: 'yellow',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    bordo: {
        borderColor: 'red',
        borderWidth:0
    }

})
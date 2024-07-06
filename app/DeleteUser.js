// import React, { useState } from "react";
// import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native";
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
// import { getDatabase, ref, remove } from "firebase/database";
// import { auth } from './firebase';
// import * as Updates from 'expo-updates';

// export default function DeleteUser(props) {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [password, setPassword] = useState("");

//     const { setUser } = props.StatiGlobali;

//     const handleDeleteUser = () => {
//         let user = auth.currentUser;

//         if (user) {
//             setLoading(true);
//             console.log("User email:", user.email);
//             console.log("User ID:", user.uid);
//             const credential = EmailAuthProvider.credential(user.email, password);

//             reauthenticateWithCredential(user, credential).then(() => {
//                 console.log("User reauthenticated");
//                 deleteUser(user).then(() => {
//                     console.log('Utente eliminato con successo');
//                     removeUserDb(user.uid)
//                 }).catch((error) => {
//                     console.error('Errore durante l\'eliminazione dell\'utente:', error);
//                     setError(error.message);
//                     setLoading(false);
//                 });
//             }).catch((error) => {
//                 console.error('Errore durante la riautenticazione:', error);
//                 setError(error.message);
//                 setLoading(false);
//             });
//         } else {
//             setError("Nessun utente attualmente loggato.");
//         }
//     }



//     const removeUserDb = (userId) => {
//         const db = getDatabase();
//         const userRef = ref(db, 'users/' + userId);
//         console.log('userRef ', userRef)
//         remove(userRef)
//             .then(() => {
//                 console.log('utente rimosso con successo');
//                 handleLogout();
//             })
//             .catch((error) => {
//                 console.error("errore nella rimozione nota")
//             })
//     }

//     const handleLogout = () => {
//         signOut(auth).then(() => {
//             console.log('Logout effettuato');
//             setLoading(false);
//             Updates.reloadAsync();
//             props.navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//             });
//         }).catch((error) => {
//             console.error('Errore durante il logout:', error);
//             setError(error.message);
//             setLoading(false);
//         });
//     }

//     const showAlert = () => {
//         Alert.alert(
//             "Eliminazione account",
//             "Sei sicuro di voler eliminare il tuo account?",
//             [
//                 { text: "Annulla", style: "cancel" },
//                 { text: "SI, ELIMINA", onPress: handleDeleteUser }
//             ],
//             { cancelable: true }
//         );
//     };

//     return (
//         <ThemedView style={styles.container}>
//             <ThemedText style={styles.text}>Sei sicuro di voler eliminare il tuo account?</ThemedText>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Inserisci la tua password"
//                 secureTextEntry
//                 value={password}
//                 onChangeText={setPassword}
//             />
//             {loading ? (
//                 <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//                 <TouchableOpacity onPress={showAlert} style={styles.button}>
//                     <ThemedText style={styles.buttonText}>SI ELIMINA</ThemedText>
//                 </TouchableOpacity>
//             )}
//             {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
//         </ThemedView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     text: {
//         fontSize: 18,
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     input: {
//         width: '80%',
//         padding: 10,
//         marginVertical: 10,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//     },
//     button: {
//         backgroundColor: 'red',
//         padding: 10,
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     errorText: {
//         marginTop: 20,
//         color: 'red',
//         textAlign: 'center',
//     },
// });


import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import { auth } from './firebase';
import * as Updates from 'expo-updates';

export default function DeleteUser(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState("");

    const handleDeleteUser = async () => {
        let user = auth.currentUser;

        if (user) {
            setLoading(true);
            console.log("User email:", user.email);
            console.log("User ID:", user.uid);
            const credential = EmailAuthProvider.credential(user.email, password);

            try {
                await reauthenticateWithCredential(user, credential);
                console.log("User reauthenticated");

                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);
                console.log('userRef ', userRef.toString());

                try {
                    await remove(userRef);
                    console.log('Dati utente eliminati dal database');
                } catch (error) {
                    console.error('Errore durante l\'eliminazione dei dati dal database:', error);
                    setError(error.message);
                    setLoading(false);
                    return;
                }

                try {
                    await deleteUser(user);
                    console.log('Utente eliminato con successo');
                } catch (error) {
                    console.error('Errore durante l\'eliminazione dell\'utente:', error);
                    setError(error.message);
                    setLoading(false);
                    return;
                }

                handleLogout();
            } catch (error) {
                console.error('Errore durante la riautenticazione:', error);
                setError(error.message);
                setLoading(false);
            }
        } else {
            setError("Nessun utente attualmente loggato.");
        }
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            console.log('Logout effettuato');
            setLoading(false);
            Updates.reloadAsync();
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }).catch((error) => {
            console.error('Errore durante il logout:', error);
            setError(error.message);
            setLoading(false);
        });
    }

    const showAlert = () => {
        Alert.alert(
            "Eliminazione account",
            "Sei sicuro di voler eliminare il tuo account?",
            [
                { text: "Annulla", style: "cancel" },
                { text: "SI, ELIMINA", onPress: handleDeleteUser }
            ],
            { cancelable: true }
        );
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.text}>Sei sicuro di voler eliminare il tuo account?</ThemedText>
            <TextInput
                style={styles.input}
                placeholder="Inserisci la tua password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity onPress={showAlert} style={styles.button}>
                    <ThemedText style={styles.buttonText}>SI ELIMINA</ThemedText>
                </TouchableOpacity>
            )}
            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    errorText: {
        marginTop: 20,
        color: 'red',
        textAlign: 'center',
    },
});

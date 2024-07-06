import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard, Linking, TouchableWithoutFeedback} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set} from 'firebase/database';

import Checkbox from 'expo-checkbox';

import { Ionicons } from "@expo/vector-icons";

export default function Login({ StatiGlobali }) {
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ripetiPassword, setRipetiPassword] = useState("");
    const [isChecked, setIsChecked] = useState(false);

    const { setUserLoaded } = StatiGlobali;

    const [registrazione, setRegistrazione] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isValidEmail = (email) => {
        const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
        return regex.test(email);
    }

    const isValidPassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
        return regex.test(password);
    }

    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((credenzialiUtente) => {
                // scrivo l'utente nel DB di firebase
                const db = getDatabase();
                set(ref(db, 'users/'+ credenzialiUtente.user.uid), {
                    nome: nome,
                    cognome: cognome,
                    email: email,
                    notes: {
                        "abc" : {
                            id: "abc",
                            titolo: "Nota di cortesia",
                            testo: " Questa è una nota di cortesia. Per modificare una nota, clicca sulla matita in alto a dx, per eliminare la nota, clicca sull'icona del cestino, per inserire una nuova nota, clicca sul pulsante in basso 'crea nota'"
                        }
                    }
                })
                    .then((resp) => {
                        console.log('dati utente salvati con successo', resp);
                        setUserLoaded(true);
                    })
                    .catch ((error) => {
                        console.error('errore nel salvataggio', error)
                    });

                console.log("account creato");
                const user = credenzialiUtente.user;
                console.log("nuovo utente: ", user);
                handleSignIn(); // Effettua automaticamente il login dopo la registrazione
            })
            .catch ((error) => {
                console.error('errore nel auth', error);
                Alert.alert(error.message);
            })
    }

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((credenzialiUtente) => {
                console.log("Entrato");
                const user = credenzialiUtente.user;
                console.log("utente: ", user);
            })
            .catch ((error) => {
                console.error('errore nel login', error);
            })
    }

    const openTerms = () => {
        const url = 'https://www.google.com';
        Linking.canOpenURL(url)
        .then((supported) => {
            console.log()
            if(supported) {
                Linking.openURL(url);
            } else {
                console.log('impossibile aprire url' + url)
            }
        })
    }

    useEffect(() => {
        if(nome !== '' && cognome !== '' && email !== '' && password !== '' && isChecked) {
            if(!isValidEmail(email)) {
                console.log('la mail inserita non è valida');
                setErrorMessage('la mail inserita non è valida');
            } else {
                if (!isValidPassword(password)){
                    console.log('la password inserita non è valida');
                    setErrorMessage('la password deve  contenere almeno 1 maiuscola, 1 minuscola, un numero ed un carattere speciale');
                } else {
                    console.log('la password inserita è valida');
                   if (password !== ripetiPassword) {
                    console.log('le password non combaciano');
                    setErrorMessage('la password inserita è valida');
                    setIsButtonEnabled(false)
                   } else {
                    console.log('le password combaciano');
                    setIsButtonEnabled(true);
                    setErrorMessage('');
                   }
                }
            }
        } else {
            console.log('pulsante disabilitato a causa di errori');
            setIsButtonEnabled(false)
        }
    }, [nome, cognome, email, password, ripetiPassword, isChecked]);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
      };

    return (
        <ThemedView style={styles.container}>
             <TouchableWithoutFeedback onPress={dismissKeyboard}>
             <ThemedView  style={styles.containerInput}>
                 {registrazione && (
                    <>
                    <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            value={nome}
                            onChangeText={setNome}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Cognome"
                            value={cognome}
                            onChangeText={setCognome}
                        />


                    </>
                 )}
           
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                 <ThemedView style={styles.containerPassword}>
                        <TextInput
                            style={styles.inputPassword}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry = {!passwordVisible}
                        />
                        <TouchableOpacity style={styles.iconEye} onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color='grey' />
                        </TouchableOpacity>
                 </ThemedView>

                 {registrazione && (
                    <>
                     <ThemedView style={styles.containerPassword}>
                                <TextInput
                                    style={styles.inputPassword}
                                    placeholder="Ripeti Password"
                                    value={ripetiPassword}
                                    onChangeText={setRipetiPassword}
                                    secureTextEntry = {!passwordVisible}
                                />
                                {/* <TouchableOpacity style={styles.iconEye} onPress={() => setPasswordVisible(!passwordVisible)}>
                                    <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color='gray' />
                                </TouchableOpacity> */}
                                
                    </ThemedView>
                        <ThemedView style={styles.containerPrivacy}>
                            <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setIsChecked} color={'grey'} />
                            <ThemedText style={styles.containerTesti}>Accetto i 
                                <TouchableWithoutFeedback onPress={openTerms} >
                                    <ThemedText style={[styles.frase, styles.link]}> termini</ThemedText>
                                </TouchableWithoutFeedback> di utilizzo
                            </ThemedText>
                        </ThemedView>
                    </>
      
                 )}
                {!registrazione && (
                    <>
                        <TouchableOpacity style={styles.btn} onPress={handleSignIn}>
                            <ThemedText style={styles.btn.testo}>Accedi</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.frase}>Se non sei registrato, clicca qui per 
                            <TouchableWithoutFeedback onPress={() => setRegistrazione(true)}>
                                <ThemedText style={[styles.frase, styles.link]}> registrarti</ThemedText>
                            </TouchableWithoutFeedback>
                        </ThemedText>
                    </>
                )}
                {registrazione && (
                    <>
                        <ThemedText>
                            {errorMessage}
                        </ThemedText>
                        <TouchableOpacity style={[styles.btn, {opacity: isButtonEnabled ? 1 : 0.3}]} onPress={handleCreateAccount} disabled={!isButtonEnabled}>
                            <ThemedText style={styles.btn.testo}>Registrati</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.frase}>Se sei già registrato, clicca qui per <TouchableWithoutFeedback onPress={() => setRegistrazione(false)}><ThemedText style={[styles.frase, styles.link]}>accedere</ThemedText></TouchableWithoutFeedback></ThemedText>
                    </>
                )}
                </ThemedView>
             </TouchableWithoutFeedback>
             
        </ThemedView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        backgroundColor: "#ededed",
    },
    containerInput: {
        width: '90%',
        height: 'auto',
        backgroundColor: "#ededed",
    },
    input: {
        borderWidth:0,
        backgroundColor: 'white',
        padding: 13,
        marginTop: 10,
     
        borderRadius:4
    },
    inputPassword: {
        borderWidth:0,
        backgroundColor: 'white',
        padding: 13,
        marginTop: 10,
     
        borderRadius:4,
        width: '100%'
    },

    containerPrivacy: {
        backgroundColor: null,
        flexDirection:'row',
        alignItems: 'baseline',
        alignContent:'flex-end',

    },

    checkbox:{
        marginTop:10,
        marginRight:10
    },

    btn: {
        alignItems: 'center',
        marginTop: 30,
        paddingVertical:10,
        borderRadius:5,
        backgroundColor: '#edd81a',
        
       testo: {
            fontWeight: 'bold'
        }
    },
    frase :{
        fontSize:14,
        alignSelf:'center'
    },
    containerTesti: {
        flexDirection: 'row',
       position:'relative',
       top:-4

    },
    link:{
        fontWeight:'bold', 
       borderWidth:0,
    },
    containerPassword: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: null,
        height: 'auto',
        padding:0
    },
    iconEye: {
        position: 'absolute',
        right: 20,
        top: 18
    }


})
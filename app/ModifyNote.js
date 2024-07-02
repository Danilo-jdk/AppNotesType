import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getDatabase, ref, update } from "firebase/database";

// import { useRoute } from "@react-navigation/native";

export default function ModifyNote (props) {
    const { note, userId, prendiNote } = props.StatiGlobali;

    const [titolo, setTitolo] = useState('');
    const [testo, setTesto] = useState('');

    // const route = useRoute();
    // const { nota } = route.params;
    const { nota } = props.route.params;
    
    console.log('nota ricevuta: ', nota)

    const modifyNote = async () => {
        try {
            const db = getDatabase();
            const notesRef = ref(db, 'users/' + userId + '/notes/' + nota.id);

            const body = {
                titolo: titolo,
                testo: testo,
                dataModifica: Date.now()
            };
            update(notesRef, body )
                .then(() => {
                    console.log('Nota modificata con successo');
                    prendiNote();
                    props.navigation.navigate('Home');
                })
            .catch((error) => {
                console.log("errore nella creazione della nota nel db: ", error)
            })
        } catch (error) {
            console.log("errore salvataggio: ", error)
        }
    }

    useEffect(() => {
        setTitolo(nota.titolo);
        setTesto(nota.testo);
    }, [])

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.containerNota}>
                
                <TextInput
                    style={styles.input}
                    placeholder="Titolo nota"
                    value={titolo}
                    onChangeText={setTitolo}
                />
                  <TextInput
                    style={[styles.input, styles.inputTesto]}
                    placeholder="Testo della nota"
                    value={testo}
                    onChangeText={setTesto}
                    multiline={true}
                />
                <ThemedView style={styles.containerBtn}>
                    <TouchableOpacity style={styles.btn} onPress={() => props.navigation.navigate('Home')}>
                        <ThemedText style={styles.btn.testo}>ANNULLA</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={modifyNote}>
                        <ThemedText style={[styles.btn.testo, {fontWeight: '700'}]}>MODIFICA</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
            {/* <TouchableOpacity style={styles.tornaIndietro} onPress={() => props.navigation.navigate('Home')}>
                <ThemedText style={styles.tornaIndietro.testo}>Torna indietro</ThemedText>
            </TouchableOpacity> */}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        

        bloccoDiTesto: {
            paddingHorizontal: 20,

            titolo: {
                color: 'orange',
                fontSize: 25,
                fontWeight: 'bold'
            },
            paragrafo: {
                fontSize: 15,
                fontWeight: '400',
                textAlign: 'justify',
                lineHeight: 16
            }
        }
    },

    containerNota: {
        backgroundColor: "rgb(255, 251, 180)",
        width: '90%',
        height: 'auto',
        padding:20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.85,
        elevation: 5,

        titolo: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'left'
        },
        testo: {
            fontSize: 12,
            textAlign: 'justify',
            marginTop: 10
        }
    },
    tornaIndietro: {
        marginTop: 10,

        testo: {
            fontWeight: '700'
        }
    },
    input: {
        borderWidth:0,
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10
    },
    inputTesto: {
        height: 200
    },

    btn: {
        alignItems: 'center',
        marginTop: 20
,        testo: {

        }
    },

    containerBtn: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent:'space-around',
        backgroundColor: "rgb(255, 251, 180)",
    }

})
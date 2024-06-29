import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, ScrollView, Platform} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import CustomModal from "./components/CustomModal";

import { getDatabase, ref, remove } from "firebase/database";

export default function Home(props) {
    const {allNotes, setNote, userId, prendiNote} = props.StatiGlobali;
    const [modalVisible, setModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handlePress = (nota) => {
        console.log('nota: ', nota);
        setNote(nota);
        props.navigation.navigate('Note')
    }

    // Converti l'oggetto allNotes in un array e poi ordina le note
    const notesArray = Object.values(allNotes).sort((a, b) => {
        return b.data - a.data; // Ordine decrescente: dalla più recente alla più vecchia
    });

    const deleteItem = (id, titolo) => {
        const notaDaEliminare = {id: id, titolo: titolo};
        setItemToDelete(notaDaEliminare);
        setModalVisible(true)
    }

    const confirmDeleteItem = (itemId) => {
        setModalVisible(false);
        removeNote(itemId);
    }

    const removeNote = (itemId) => {
        const db = getDatabase();
        const notaRef = ref(db, 'users/' + userId + '/notes/' + itemId);

        remove(notaRef)
            .then(() => {
                console.log('nota rimossa con successo');
                prendiNote();
            })
            .catch((error) => {
                console.error("errore nella rimozione nota")
            })
    }

    return (
        <>
          {notesArray.length > 0 ? (
                    <ScrollView style={styles.scroll}>
                           <ThemedView style={styles.container}>
                           { notesArray.map((nota, index) => (
                            
                                <ThemedView style={styles.containerNota} key={index}>

                                    <ThemedView style={styles.containerBtnUpdate}>
                                        <TouchableOpacity onPress={() => null}>
                                            <FontAwesome5 name="pen" size={20} color="black" />
                                        </TouchableOpacity>
                                    </ThemedView>

                                    <TouchableOpacity onPress={() => handlePress(nota)}>
                                        <ThemedText style={styles.containerNota.titolo}>{nota.titolo}</ThemedText>
                                        <ThemedText style={styles.containerNota.testo}>{nota.testo}</ThemedText>
                                    </TouchableOpacity>

                                    <ThemedView style={styles.containerBtnDelete}>
                                        <TouchableOpacity onPress={() => deleteItem(nota.id, nota.titolo)}>
                                            <Feather name="trash-2" size={20} color="black" />
                                        </TouchableOpacity>
                                    </ThemedView>

                                </ThemedView>
                            )) }
                            </ThemedView>
                            <CustomModal 
                                isVisible={modalVisible}
                                onConfirm={confirmDeleteItem}
                                onCancel={() => setModalVisible(false)}
                                item={itemToDelete}
                            />
                    </ScrollView>
                    ) : (
                        <ThemedView style={styles.centro}>
                                <ThemedText>Nessuna nota</ThemedText>
                        </ThemedView>
                )
            }
        </>
    )
}

const styles = StyleSheet.create({
    centro: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
    },
    scroll: {
        flex:1,
         backgroundColor:'white',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        paddingTop:20,
        zIndex:1,

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
        height: 200,
        padding:20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.85,
        elevation: 5,
        marginBottom:10,
        marginTop:10,

        titolo: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'left',
            color: 'black'
        },
        testo: {
            fontSize: 12,
            textAlign: 'justify',
            marginTop: 3,
            color: 'black',
            height: 148,
            width: '98%',
        },
    },
    containerBtnUpdate: {
        alignItems:'flex-end',
        backgroundColor: null,
        position: 'absolute',
        right:10,
        top: 10
    },
    containerBtnDelete: {
        alignItems:'flex-end',
        backgroundColor: null,
        position: 'absolute',
        right:10,
        bottom: 10,
      
    }
})
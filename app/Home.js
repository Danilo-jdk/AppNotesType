import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, ScrollView, Platform, Image, View} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import CustomModal from "./components/CustomModal";

import { getDatabase, ref, remove } from "firebase/database";

import {  ref as storageRef, deleteObject } from "firebase/storage";
import { storage, auth } from "./firebase";

export default function Home(props) {
    const {allNotes, setNote, userId, prendiNote, isOffline} = props.StatiGlobali;
    const [modalVisible, setModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [vis, setVis] = useState(false)

    const imgOffline = '../assets/images/offline.png';

    const [user, setUser] = useState(null)

    const handlePress = (nota) => {
        console.log('nota: ', nota);
        setNote(nota);
        props.navigation.navigate('Note')
    }

    // Converti l'oggetto allNotes in un array e poi ordina le note
    const notesArray = Object.values(allNotes).sort((a, b) => {
        return b.data - a.data; // Ordine decrescente: dalla più recente alla più vecchia
    });

    const deleteItem = (id, titolo, imageUrl) => {
        console.log('deleteItem ' +  imageUrl)
        const notaDaEliminare = {id: id, titolo: titolo, imageUrl: imageUrl};
        setItemToDelete(notaDaEliminare);
        setModalVisible(true)
    }

    const confirmDeleteItem = (item) => {
        setModalVisible(false);
        console.log('confirmDeleteItem ' +  item.imageUrl)
       deleteImage(item.imageUrl)
       removeNote(item.id);
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


    const deleteImage = async (noteImageUrl) => {
        try {
            //const path = decodeURIComponent(noteImageUrl.split('/o/')[1].split('?')[0]);
            const imageRef = storageRef(storage, noteImageUrl);
            await deleteObject(imageRef);
            console.log('immagine eliminata');
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        let user = auth.currentUser;
        setUser(user);
        console.log('utente,' + user)
    })
    return (
        <>
          {notesArray.length > 0 ? (
                    <ScrollView style={styles.scroll}>
                           <ThemedView style={styles.container}>
                                {isOffline && (
                                  <>
                                    
                                        <Image source={require(imgOffline)} style={styles.offline} />
                                    
                                    <ThemedView style={styles.containerOffline}>
                                        <Feather name="wifi-off" size={20} color={'black'} />
                                        <ThemedText>Offline - Modalità sola lettura</ThemedText>
                                    </ThemedView>
                                    </>
                                )}
                            

                           { notesArray.map((nota, index) => (
                            
                                <ThemedView style={styles.containerNota} key={index}>
                                     {!isOffline && (
                                    <ThemedView style={styles.containerBtnUpdate}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('ModifyNote', {nota: nota})}>
                                            <FontAwesome5 name="pen" size={20} color="black" />
                                        </TouchableOpacity>
                                    </ThemedView>
                                     )}

                                    <TouchableOpacity onPress={() => handlePress(nota)} style={styles.containerCorpoNota}>
                                        {nota.imageUrl && (
                                            <Image source={{ uri: nota.imageUrl }} style={styles.image} />
                                        )}
                                        <ThemedText style={styles.containerNota.titolo}>{nota.titolo}</ThemedText>
                                        <ThemedText style={styles.containerNota.testo}>{nota.testo}</ThemedText>
                                    </TouchableOpacity>

                                    {!isOffline && (
                                    <ThemedView style={styles.containerBtnDelete}>
                                        <TouchableOpacity onPress={() => deleteItem(nota.id, nota.titolo, nota.imageUrl)}>
                                            <Feather name="trash-2" size={20} color="black" />
                                        </TouchableOpacity>
                                    </ThemedView>
                                    )}

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
    containerCorpoNota: {
        borderWidth:0,
        width: '95%'
    },
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
    containerOffline: {
        flexDirection: 'column'
    },
    offline: {
        width: '70%',
        height: 200
    },
    containerNota: {
        backgroundColor: "rgb(255, 251, 180)",
        width: '90%',
        minHeight: 200,
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
      
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover'
    }

})
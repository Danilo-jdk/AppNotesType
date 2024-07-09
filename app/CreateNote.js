import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getDatabase, ref, set, push } from "firebase/database";

import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref as storageRef, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export default function CreateNote (props) {
    const { note, userId, prendiNote } = props.StatiGlobali;

    const [titolo, setTitolo] = useState('');
    const [testo, setTesto] = useState('');

    const [imageUrl, setImageUrl ] = useState(null);

    const [isLoading, setIsLoading] = useState(false)

    const saveNote = async () => {
        try {
            const db = getDatabase();
            const notesRef = ref(db, 'users/' + userId + '/notes');

            const newNotesRef = push(notesRef);
            const body = {
                id:newNotesRef.key.toString(),
                titolo: titolo,
                testo: testo,
                imageUrl: imageUrl,
                data: Date.now()
            };
            set(newNotesRef, body )
                .then(() => {
                    console.log('dati della nota salvati');
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

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            // aspect: [1,1]
        });
        if (!result.canceled){
            setIsLoading(true)
            const source = { uri: result.assets[0].uri };
            uploadImage(source.uri);
        }
    }

    const uploadImage = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const storageReference = storageRef(storage, `images/${filename}`);
            await uploadBytes(storageReference, blob);

            const url = await getDownloadURL(storageReference);
            setImageUrl(url);
            console.log('foto caricata con successo: ', url);
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    const deleteImage = async (noteImageUrl) => {
        try {
            const imageRef = storageRef(storage, noteImageUrl);
            await deleteObject(imageRef);
            console.log('immagine eliminata');
            setImageUrl(null)
        } catch (error) {
            console.error(error)
        }
    }

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
                {!imageUrl  && !isLoading && (
                <TouchableOpacity style={styles.btn} onPress={selectImage}>
                    <ThemedText style={styles.btn.testo}>SELEZIONA IMMAGINE</ThemedText>
                </TouchableOpacity>
                )}
                {isLoading && (
                    <ActivityIndicator size='large' />
                )}
                {imageUrl && !isLoading && (
                   <>
                     <ThemedView style={styles.imagePreview}>
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    </ThemedView>
                    <TouchableOpacity style={styles.btn} onPress={() => deleteImage(imageUrl)}>
                        <ThemedText style={styles.btnTesto}>ELIMINA FOTO</ThemedText>
                    </TouchableOpacity>
                   </>
                )}
                <TouchableOpacity style={styles.btn} onPress={saveNote}>
                    <ThemedText style={styles.btn.testo}>INSERISCI NOTA</ThemedText>
                </TouchableOpacity>
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
        marginTop: 20,
        testo: {

        }
    },
    imagePreview: {
        marginTop: 10,
        alignItems: 'center',
        height: 200,
        backgroundColor: null
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover'
    }

})
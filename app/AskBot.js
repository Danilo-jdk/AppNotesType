import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, ScrollView, Image, Keyboard, TextInput, ActivityIndicator} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import chatApi from './AI/Api';
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import * as Clipboard from 'expo-clipboard';
import Toast from "react-native-toast-message";

export default function AskBot (props) {
    const [domanda, setDomanda] = useState("");
    const [risposta, setRisposta] = useState("");
    const [titoloRicetta, setTitoloRicetta] = useState("");
    const [personNumber, setPersonNumber ] = useState("4");

    const [isLoading, setIsLoading] = useState(false);

    const [isFocused, setIsFocused ]= useState(false);
   
    async function getChatBot () {
        Keyboard.dismiss();
        setIsLoading(true);
        setRisposta('');
        try {
            const response = await chatApi.getChatGPTResponse(domanda, personNumber);
            console.log('response : ' + response)
            if(response && response.length > 0 ) {
                const risposta = response;
                setRisposta(risposta);
                setTitoloRicetta(domanda);
                setDomanda("")
            }
        } catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false);
            setDomanda("");
        }
    }


    const copiaRisposta = () => {
        const testoDaCopiare = `${titoloRicetta}\n${risposta}`;
        Clipboard.setStringAsync(testoDaCopiare);
        Toast.show({
            type: 'success',
            text1: 'Ingredienti copiati'
        })
    }
    return (
        <ThemedView style={styles.container}>
                <ThemedView  style={styles.container.containerParteSopra}>
                    <ThemedView style={styles.container.containerNota}>
                        <ThemedText style={styles.container.containerNota.titolo}>
                            Cerca gli ingredienti da comprare per la tua ricetta.
                        </ThemedText>
                        <ThemedText>
                            Scrivi il nome della ricetta:
                        </ThemedText>
                        <TextInput
                         style={[styles.input, styles.inputTestoRicetta]}
                         placeholder="es. spaghetti alla carbonara"
                         onChangeText={setDomanda}
                         multiline={true}
                         onFocus={() => setIsFocused(true)}
                         onBlur={() => setIsFocused(false)}
                        />
                        <ThemedView style={styles.containerPerson}>
                                <ThemedText>n. persone:</ThemedText>
                                <ThemedView style={styles.pickerContainer}>
                                <Picker 
                                selectedValue={personNumber}
                                onValueChange={(itemValue, itemIndex) => setPersonNumber(itemValue)}
                                style={styles.picker}
                                mode="dropdown"
                                >
                                    <Picker.Item label="2" value="2" />
                                    <Picker.Item label="4" value="4" />
                                    <Picker.Item label="6" value="6" />
                                    <Picker.Item label="8" value="8" />
                                </Picker>
                                </ThemedView>
                        
                        </ThemedView>
                        <TouchableOpacity
                            onPress={getChatBot}
                            style={styles.container.tornaIndietro}
                        >
                            {/* <Text style={styled.btnInsert}>CERCA</Text> */}
                            <Feather name="search" size={30} color="black" style={styles.iconaSearch}/>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.containerParteSotto}>
                    { risposta?.length > 0 && !isFocused && (
                        <>
                            <ScrollView style={styles.containerRisposta}>
                                <ThemedText style={styles.container.containerNota.titolo}>{titoloRicetta}</ThemedText>
                                <ThemedText style={styles.testoRisposta}>{risposta}</ThemedText>
                                <ThemedView style={styles.containerCopy}>
                                    <TouchableOpacity onPress={copiaRisposta} style={styles.btnInsert}>
                                        <Feather name="copy" size={25} color={'black'} style={styles.iconaCopy} />
                                    </TouchableOpacity>
                                </ThemedView>
                            </ScrollView>
                        </>
                    )}
                    {isLoading && (
                        <ActivityIndicator size={'large'} />
                    )}
                    <Toast ref={ (ref) => Toast.setRef(ref)} />
                </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
        
            bloccoDiTesto: {
              paddingHorizontal: 20,
        
              titolo: {
                color: "orange",
                fontSize: 25,
                fontWeight: "bold",
              },
              paragrafo: {
                fontSize: 10,
                textAlign: "justify",
              },
            },
            containerParteSopra: {
                flex:1,
                width: "95%",
              },
            containerNota: {
              backgroundColor: "rgb(255, 251, 180)",
              padding: 10,
              height:260,
              alignItems: "center",
                marginTop: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
        
              titolo: {
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "left",
              },
              testo: {
                fontSize: 12,
                textAlign: "justify",
                marginTop: 10,
              },
            },
        
            tornaIndietro: {
              marginTop: 20,
              borderWidth: 0,
              borderColor: 'red',
        
              testo: {
                fontWeight: "700",
              },
            },
          },
        
          input: {
            borderWidth: 0,
            width: "100%",
            backgroundColor: "white",
            padding: 10,
            marginTop: 20,
            verticalAlign: "top",
            
          },
          inputTestoNota: {
            height: 50,
          },
          btnInsert: {
            fontWeight: "bold",
            color: "grey",
            marginTop:-10
          },
          containerParteSotto: {
            borderWidth: 0,
            borderColor: 'red',
            flex:1,
            width: "90%",
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: "rgb(255, 251, 220)",
            padding:5,
          },
          containerRisposta: {
            marginTop: 0,
            borderColor: "black",
            backgroundColor: "rgb(255, 251, 220)",
           padding:10,
            height: 250
          },
          testoRisposta: {
            fontSize:15,
          
        },
        containerPerson: {
          flexDirection:  "column",
          justifyContent:  "space-between",
          alignItems:  "center",
          marginTop: 5,
          borderWidth: 0,
          borderColor: 'red',
          width: '80%',
          backgroundColor: null
        },
        pickerContainer: {
            height: 60, // Imposta l'altezza desiderata qui
            width: '100%',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            overflow: 'hidden',
            marginBottom:20
          },
          picker: {
            position: 'relative',
            top: -80,
            color: 'white', // Imposta il colore del testo del Picker
          },
          inputPicker: {
            color: "#fff",
            fontSize: 20,
            backgroundColor: "#0F141E",
            paddingHorizontal: 5,
            marginBottom: 10,
          },
        iconaSearch: {
            position: 'absolute',
          marginTop: -70,
          left: 150,
        },
        containerCopy: {
          flexDirection:'row',
          justifyContent: 'flex-end',
          marginTop: 0,
          paddingBottom: 15,
          backgroundColor: null

        },
        titoloRicetta: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
        },
        iconaCopy: {
          marginTop: -15,
          paddingBottom: 15,
        }
        
})
import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, ScrollView, Image} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Note (props) {
    const { note } = props.StatiGlobali;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.containerNota}>
            {note.imageUrl && (
                 <Image source={{ uri: note.imageUrl }} style={styles.image} />
             )}
                <ThemedText style={styles.containerNota.titolo}>{note.titolo}</ThemedText>
                <ScrollView>
                    <ThemedText style={styles.containerNota.testo}>{note.testo}</ThemedText>
                </ScrollView>
            </ThemedView>
            <TouchableOpacity style={styles.tornaIndietro} onPress={() => props.navigation.navigate('Home')}>
                <ThemedText style={styles.tornaIndietro.testo}>Torna indietro</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        zIndex: 1,

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
        minHeight: 400,
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
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain'
    }
})
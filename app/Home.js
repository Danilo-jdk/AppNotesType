import React, {useState, useEffect} from "react";
import { StyleSheet, TouchableOpacity, ScrollView, Platform} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Home(props) {
    const {allNotes, setNote} = props.StatiGlobali;

    const handlePress = (nota) => {
        console.log('nota: ', nota);
        setNote(nota);
        props.navigation.navigate('Note')
    }

    return (
        <ScrollView>

     
        <ThemedView style={styles.container}>
            <ThemedView style={styles.container.bloccoDiTesto}>
                <ThemedText style={styles.container.bloccoDiTesto.titolo}>Benvenuti nella home</ThemedText>
                <ThemedText style={styles.container.bloccoDiTesto.paragrafo}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.</ThemedText>
            </ThemedView>
            { allNotes?.map((nota, index) => (
                <ThemedView style={styles.containerNota} key={index}>
                    <TouchableOpacity onPress={() => handlePress(nota)}>
                        <ThemedText style={styles.containerNota.titolo}>{nota.noteTitle}</ThemedText>
                        <ThemedText style={styles.containerNota.testo}>{nota.noteText}</ThemedText>
                    </TouchableOpacity>
                 
                </ThemedView>
            ))}
        </ThemedView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
            marginTop: 10,
            color: 'black'
        }
    }
})
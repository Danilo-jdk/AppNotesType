import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconFont from 'react-native-vector-icons/FontAwesome6';
export default function Footer() {
    const navigation = useNavigation();

    return (
        <ThemedView style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.contenitore}>
                <Icon name='home' size={30} color='#000' />
                <ThemedText style={styles.text}>Login</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.contenitore}>
                <Icon name='home' size={30} color='#000' />
                <ThemedText style={styles.text}>home</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreateNote')} style={styles.contenitore}>
                <IconFont name='notes-medical' size={30} color='#000' />
                <ThemedText style={styles.text}>crea nota</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'yellow',
        paddingTop: 10
    },
    contenitore: {
        alignItems: 'center'
    },
    text: {
        fontSize:10,
        marginTop:-5
    }
})


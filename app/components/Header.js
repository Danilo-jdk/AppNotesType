import React from "react";
import { StyleSheet, TouchableOpacity, Platform, Image} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Header() {
    const logo = '../../assets/images/logo_app_notes.png';

    return (
        <ThemedView style={[styles.shadowWrapper, styles.bordo]}>
            <ThemedView style={[styles.header, ]}>
                <Image source={require(logo)} style={styles.logo} />
            </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'yellow',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        color: 'black',
        marginTop: 20,
        paddingTop:5
    },
    shadowWrapper: {
        backgroundColor: 'white',
        paddingBottom: 10,
        backgroundColor: "yellow",
        ...Platform.select({
            android: {
                elevation: 3,
                paddingTop: 30,
            },
            ios: {
                shadowOffset: {
                width: 0,
                height: 5
                },
                paddingTop: 0,
            }
        }),
        
        shadowColor: "#000",
        
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderBottomColor: 'lightgray',
        borderBottomWidth:0,
        zIndex:10
    },
    logo : {
        height: 60,
        width: 160
    },
    bordo: {
        borderColor: 'red',
        borderWidth:0
    }

})
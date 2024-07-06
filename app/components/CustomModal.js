import React from "react";
import { Modal, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const CustomModal = ({isVisible, onConfirm, onCancel, item }) => {
    return (
        <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onCancel}
        >
            <ThemedView style={styles.centeredView}>
                <ThemedView style={styles.modalView}>
                    <ThemedText>{item?.titolo ? 'Sei sicuro di voler eliminare la seguente nota: "' + item?.titolo + '"': "Sei sicuro di voler uscire dall'app"} ?</ThemedText>
                    <ThemedView style={styles.btnContainer}>
                        <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onCancel}>
                            <ThemedText style={styles.textStyle}>ANNULLA</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={item?.titolo ? () => onConfirm(item) : onConfirm}>
                            <ThemedText style={styles.textStyle}>{item?.titolo ? 'ELIMINA' : "ESCI"}</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </ThemedView>

        </Modal>
    )
}

export default CustomModal;

const styles = StyleSheet.create({
    centeredView: {
        backgroundColor: 'black',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        width: '70%',
        margin: 'auto',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 20
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    btn: {

        width: 100,
        alignItems: 'center',
        height:40,
        justifyContent: 'center',
        borderRadius: 10,
        marginHorizontal:5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation:5
    },
    btnCancel: {
        backgroundColor: 'grey',
    },
    btnConfirm: {
        backgroundColor: '#e2cc00',
    },
    textStyle: {
        color: 'white',
        fontWeight: '600'
    }
})

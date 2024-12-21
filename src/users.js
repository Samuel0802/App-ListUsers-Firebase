import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { db } from "./firebaseConnection";
import { deleteDoc, doc } from "firebase/firestore";

export function Userlist({data, handleEdit}){

    //função para deletar users
async function deleteItem(){
    const docRef = doc(db, "users", data.id); //Referencia para deletar
    await deleteDoc(docRef);
    console.log(data);
}

async function  EditUsers() {
    handleEdit(data);
    console.log(data);
}

    return(
        <View style={styles.container}>
            <Text style={styles.item}>Nome: {data.nome}</Text>
            <Text style={styles.item}>Idade: {data.idade}</Text>
            <Text style={styles.item}>Cargo: {data.cargo}</Text>

            <TouchableOpacity style={styles.btn} onPress={ deleteItem}>
                <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, {backgroundColor: "#000"}]} onPress={ EditUsers}>
                <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

     container: {
        backgroundColor: "#f0f0f0",
        padding: 8,
        borderRadius: 4,
        marginBottom: 14
     }, 
     item:{
        color: "#000",
        fontSize: 16
     },

     btn:{
        backgroundColor: "#b3261e",
        alignSelf: "flex-end",
        padding: 4,
        borderRadius: 4,
        marginTop: 16
     },

     btnText:{
        color: '#fff',
        paddingLeft: 8,
        paddingRight: 8
     
     }
});
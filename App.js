import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import { db } from "./src/firebaseConnection";//Importando banco de dados
import { doc, getDoc, onSnapshot, setDoc, collection, addDoc, getDocs } from "firebase/firestore"; //Importando os recursos do firebase
import { Userlist } from "./src/users";

export default function App() {

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [cargo, setCargo] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [users, setUsers] = useState([]); //item da minha lista


  useEffect(() => {

    //listando os user cadastrado
    async function PuxarDados() {

      const usersRef = collection(db, "users"); //Criado referencia

      onSnapshot(usersRef, (snapshot) => {

        let listaUser = [];

        snapshot.forEach((doc) => { //pecorrer a lista
          listaUser.push({ //colocando algo no array
            id: doc.id,
            nome: doc.data().nome,
            idade: doc.data().idade,
            cargo: doc.data().cargo,
          }) 
        })
        setUsers(listaUser); //buscou  e colocou no array vazio da minha useState

      })

      //  getDocs(usersRef) //recuperando 
      //  //snapshot: foto do banco de dados
      //  .then((snapshot) => {

      //    let listaUser = [];

      //    snapshot.forEach((doc) =>{ //pecorrer a lista
      //     listaUser.push({ //colocando algo no array
      //     id: doc.id,
      //     nome: doc.data().nome,
      //     idade: doc.data().idade,
      //     cargo: doc.data().cargo,
      //     })
      //    })

      //  setUsers(listaUser); //buscou  e colocou no array vazio da minha useState
      //  })

      //  .catch((err) =>{
      //   console.log(err);
      //  })


    }

    PuxarDados();


  }, [])

  //função de cadastrar user
  async function Registrar() {

    await addDoc(collection(db, "users"), { //cadastrando usuario no banco
      nome: nome,
      idade: idade,
      cargo: cargo
    })

      .then(() => {
        console.log("Cadastrado com sucesso");
        setNome(""); //Limpando o input após o envio
        setIdade("");
        setCargo("");
      })

      .catch((err) => {
        console.log(err);
      })

  }

  function Esconder() {
    setShowForm(!showForm); //passando negação do valor atual
  }



  return (
    <View style={styles.container}>

      {showForm && ( //quando showForm tive true form vai aparecer
        <View>
          <Text style={styles.label} >Nome:</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={(text) => setNome(text)}
          />

          <Text style={styles.label} >Idade:</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua idade"
            value={idade}
            onChangeText={(text) => setIdade(text)}
          />

          <Text style={styles.label} >Cargo:</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu cargo"
            value={cargo}
            onChangeText={(text) => setCargo(text)}
          />

          <TouchableOpacity style={styles.btn} onPress={Registrar}>
            <Text style={styles.btnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={Esconder}>
        <Text style={styles.btnText}>
          {showForm ? "Esconder Form" : "Mostrar Form"}</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 14, marginLeft: 8, fontSize: 20, color: "#000" }}>Usuarios</Text>

      <FlatList
        data={users}
        style={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Userlist data={item} />}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    margin: 10
  },

  btn: {
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 5
  },

  btnText: {
    padding: 8,
    color: '#fff',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    marginLeft: 8,
    marginRight: 8
  },

  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
    fontWeight: 'bold',
    margin: 10
  },
  list: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8
  }


});
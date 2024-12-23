import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import { db , auth } from "./firebaseConnection";//Importando banco de dados
import { doc, getDoc, onSnapshot, setDoc, collection, addDoc, getDocs, updateDoc } from "firebase/firestore"; //Importando os recursos do firebase
import { Userlist } from "./users";
import { signOut } from "firebase/auth";

export  function FormUsers() {

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [cargo, setCargo] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [users, setUsers] = useState([]); //item da minha lista
  const [editar , setEditar] = useState("");


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

  function editUsuario(data){
    //Recuperando os dados no campo para editar
    setNome(data.nome);
    setIdade(data.idade);
    setCargo(data.cargo);
    setEditar(data.id);

  }

  //Função para realizar update
  async function handleEdit(){
    const docRef = doc(db, "users", editar); //referencia aonde vc quer editar
    await updateDoc(docRef, { //Atualizou o documento
      nome: nome,
      idade: idade,
      cargo: cargo
    })
    setNome(""); //Limpando o input após o envio
    setIdade("");
    setCargo("");
    setEditar(""); //Verificou o campo para mudar status do botão

  }


  async function handleLogout() {
    await signOut(auth);
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

    
          {
            editar !== "" ? ( //Se for Diferente de uma string vazia 
              //Vai exibir Editar usuario
              <TouchableOpacity style={styles.btn} onPress={handleEdit}>
              <Text style={styles.btnText}>Editar Usuario</Text>
            </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={Registrar}>
              <Text style={styles.btnText}>Adicionar</Text>
            </TouchableOpacity>
            )
          }
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
        renderItem={({ item }) => <Userlist data={item} handleEdit={ (item) => { editUsuario(item)} }/>}
      />

          <TouchableOpacity style={[styles.btn, {backgroundColor: "red"}]} onPress={handleLogout}>
        <Text style={styles.btnText}>
          Sair da conta</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
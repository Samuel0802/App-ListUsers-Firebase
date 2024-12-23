import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import { FormUsers } from "./src/FormUsers";
import { auth } from "./src/firebaseConnection";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged, signOut } from "firebase/auth"; //metodo de criar/login do user

export default function App() {

  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [authUser, setAuthUser] = useState(null);// Observa se tem user logado
  const [loading, setLoading] = useState(true);

  //Renderizar nome user logado no app
  useEffect( () => {
 const unsub = onAuthStateChanged(auth, (user) => {
  if(user){
    setAuthUser({
      email:  user.email, 
      uid: user.id,
    })

    setLoading(false);
    return;
  }

  setAuthUser(null); //Caso não tenha usuario carregar nulo
    setLoading(false);
 })
  },[])

  //Criar usuario no firebase
  async function CreateUser() {
    const user = await createUserWithEmailAndPassword(auth, Email, Senha)
   console.log(user);
  }

  //login do user
  async function  handleLogin() {
     signInWithEmailAndPassword(auth, Email, Senha)
     .then( (user) => {
      console.log(user);
      setEmail("");
      setSenha("");

      setAuthUser({
        email: user.user.email,
        uid: user.user.uid
      })
     
     })

   .catch( err => {
    console.log(err.code);
    if(err.code === 'auth/missing-password'){
      console.log("Preencha a senha");
    }
   })
  
  }

  //Sair da conta
  async function logout() {
    await signOut(auth);

    setAuthUser(null);
  }

//Se tiver algo no authUser carregar algo
if(authUser){
 return(
 <View style={styles.container}>
   <FormUsers/>
 </View>
 );
}
 
  return (
    <View style={styles.container}>
      {/* <FormUsers/> */}

       {loading && <Text>Carregando...</Text>} 

       <Text style={styles.label} >Usuario Logado: {authUser && authUser.email}</Text>
       
  {/* {authUser && authUser.email}: se tiver um AuthUser carregar qual users */}
      <Text style={styles.label} >Email:</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={Email}
        onChangeText={(text) => setEmail(text)}
      />


      <Text style={styles.label} >Senha:</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={Senha}
        onChangeText={(text) => setSenha(text)}
        secureTextEntry={true} //esconder a senha do input
      />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={CreateUser}>
        <Text style={styles.btnText}>Cadastrar</Text>
      </TouchableOpacity>

    {
      authUser && (
        <TouchableOpacity style={[styles.btn, {backgroundColor: "red"}]} onPress={logout}>
        <Text style={styles.btnText}>Sair</Text>
      </TouchableOpacity>

      )
    }
      

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


});
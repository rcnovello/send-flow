//import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup,signInWithEmailAndPassword, GoogleAuthProvider, signOut, User , createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, limit  } from "firebase/firestore";
import { Button, Grid, Card, CardContent, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
//import "tailwindcss/tailwind.css";
//import tailwindcss from '@tailwindcss/vite'

/*
function App_old() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
  */

/*
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // 🔑 Chave da API para autenticar requisições no Firebase.
  authDomain: "YOUR_AUTH_DOMAIN", // 🌐 Domínio de autenticação (ex: send-flow.firebaseapp.com).
  projectId: "YOUR_PROJECT_ID", // 🏗️ ID único do projeto Firebase.
  storageBucket: "YOUR_STORAGE_BUCKET", // 📦 Nome do bucket de armazenamento do Firebase (ex: send-flow.appspot.com).
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // 📩 ID para mensagens do Firebase Cloud Messaging (FCM).
  appId: "YOUR_APP_ID", // 📱 Identificador único do app dentro do Firebase.
};
*/

const firebaseConfig = {
  apiKey: "AIzaSyA_elLuBBVGoe-lEsovL5JJHojx7Wl2Bf8",
  authDomain: "send-flow-2ecc8.firebaseapp.com",
  projectId: "send-flow-2ecc8",
  storageBucket: "send-flow-2ecc8.firebasestorage.app",
  messagingSenderId: "650908199036",
  appId: "1:650908199036:web:0dbed2371080049bf6c1f9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//const provider = new GoogleAuthProvider();
const provider = new GoogleAuthProvider();

const Login: React.FC<{ setUser: (user: User | null) => void }> = ({ setUser }) => {
//const App: React.FC = () => {
  //const [user, setUser] = useState<User | null>(null);

  const [user] = useState<User | null>(null);
  //const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

/*
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  */


  const handleLogin = async () => {
    try {

      /*
      const result = await signInWithPopup(auth, provider);
      */

       //await signInWithEmailAndPassword(auth, "ronnicorrea@hotmail.com", "!#@06129192Fb")
       await signInWithEmailAndPassword(auth, "ronnicnovello@gmail.com", "06129192")
      .then(async (userCredential) => {
        
        console.log("Usuário autenticado:", userCredential.user);
        const user = userCredential.user;        
        setUser(user);
      
        const userDoc = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDoc);
        
        if (!userSnap.exists()) {
          await setDoc(userDoc, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
          });
        }

      })
      .catch((error) => {
        console.error("Erro ao autenticar:", error);
      });

    } catch (error) {
      console.error("Erro ao autenticar:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Erro ao autenticar com Google:", error);
    }
  };

  const handleEmailAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Erro ao autenticar com e-mail:", error);
    }
  };

  /*
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  */


  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const criarOuAtualizarUsuario = async () => {
    try {
      await setDoc(doc(db, "users", "123"), {
        nome: "João Silva",
        email: "joao@email.com",
        idade: 30,
      });
      console.log("Usuário salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };
  
  //criarOuAtualizarUsuario();

  const obterUsuario = async () => {
    try {
      const docRef = doc(db, "users", "123");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log("Dados do usuário:", docSnap.data());
      } else {
        console.log("Usuário não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };
  
  //obterUsuario();


  /*
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Firebase Auth + Firestore
          </Typography>
          {user ? (
            <div className="text-center">
              <Typography variant="h6">Olá, {user.email}!</Typography>
              <Button variant="contained" color="secondary" onClick={handleLogout} className="mt-4">
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login com Google
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
  */


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Firebase Auth
          </Typography>
          {user ? (
            <div className="text-center">
              <Typography variant="h6">Olá, {user.displayName || user.email}!</Typography>
              <Button variant="contained" color="secondary" onClick={handleLogout} className="mt-4">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <TextField
                label="E-mail"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Senha"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <Button variant="contained" color="primary" onClick={handleEmailAuth}>
                {isRegistering ? "Registrar" : "Login"}
              </Button>
              <Button variant="outlined" color="primary" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Já tem conta? Faça login" : "Criar conta"}
              </Button>
              <Button variant="contained" color="secondary" onClick={handleGoogleLogin}>
                Login com Google
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/*
  const UsersList: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
    const [users, setUsers] = useState<any[]>([]);
  
    useEffect(() => {
      const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsers(querySnapshot.docs.map((doc) => doc.data()));
      };
      fetchUsers();
    }, []);

    
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-96 p-6 shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4">
              Minha Lista de Conexões
            </Typography>
            {user && <Typography variant="h6">Olá, {user.displayName || user.email}!</Typography>}
            <Button variant="contained" color="secondary" onClick={onLogout} className="mt-4">
              Logout
            </Button>
            <div className="mt-4">
              {users.map((usr, index) => (
                <Typography key={index}>{usr.name || usr.email}</Typography>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );

  };
  */

  
  const UsersList: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
    //const [users, setUsers] = useState<any[]>([]);

    const [users, setUsers] = useState<any[]>([]);

    const [contatos, setContatos] = useState<any[]>([]);
  
    useEffect(() => {

      
      const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsers(querySnapshot.docs.map((doc) => doc.data()));
      };
      fetchUsers();
      

      const fetchConexoes = async () => {

        try {
          // 🔹 Criar consulta para conexões filtradas pelo usuário
          const conexoesRef = collection(db, "conexoes");
          //const conexoesQuery = query(conexoesRef, where("nm_conexao", "==", 'fzgMEewN1WYFtaCBYKZntfCYINm1'), limit(10));
          const conexoesQuery = query(conexoesRef, where("nm_conexao", "==", user?.uid), limit(10));
          
          const conexoesSnapshot = await getDocs(conexoesQuery);

          const conexoesIDs = conexoesSnapshot.docs.map((doc) => doc.id); // 🔥 Extraindo IDs corretamente


          // 🔹 Criar consulta para contatos filtrados pelo usuário
          const contatosRef = collection(db, "contatos");
          const contatosQuery = query(contatosRef, where("id_contato", "in", conexoesIDs), limit(10));
          const contatosSnapshot = await getDocs(contatosQuery);

          // 🔹 Transformar os documentos em um array de objetos
          const conexoes = conexoesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const contatos = contatosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          setContatos(contatos);

          //console.log("Conexões do usuário:", conexoes);
          //console.log("Contatos do usuário:", contatos);

          //return { conexoes, contatos };
        } catch (error) {
          console.error("Erro ao buscar conexões e contatos:", error);
        }
      };

      fetchConexoes();

    }, []);

    /*
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-96 p-6 shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4">
              Minha Lista de Conexões
            </Typography>
            {user && <Typography variant="h6">Olá, {user.displayName || user.email}!</Typography>}
            <Button variant="contained" color="secondary" onClick={onLogout} className="mt-4">
              Logout
            </Button>
            <div className="mt-4">
              {contatos.map((contato, index) => (
                <Typography key={index}>{contato.nr_telefone + contato.nm_contato}</Typography>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
    */


  //const [contatos, setContatos] = useState<{ id: string; nm_contato: string; nr_telefone: string }[]>([]);
  const [open, setOpen] = useState(false);
  //const [nmContato, setNmContato] = useState("");
  //const [nrTelefone, setNrTelefone] = useState("");

  // Função para abrir/fechar modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 text-center font-bold">
              Minha Lista de Conexões
            </Typography>
  
            {user && (
              <Typography variant="h6" className="text-center mb-4">
                Olá, {user.displayName || user.email}!
              </Typography>
            )}
  
          <Button variant="contained" color="primary" onClick={handleOpen} className="w-full mb-4">
            Novo Contato
          </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={onLogout}
              className="w-full mb-4"
            >
              Logout
            </Button>
  
            {contatos.length > 0 ? (
              <Grid container spacing={2}>
                {contatos.map((contato) => (
                  <Grid
                    item
                    xs={12}
                    key={contato.id}
                    className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <Typography variant="body1" className="font-semibold">
                        {contato.nm_contato}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {contato.nr_telefone}
                      </Typography>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => onLogout()}
                      >
                        Enviar Mensagem
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => onLogout()}
                      >
                        Agendar Envio
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={onLogout}
                        className="w-full mb-4"
                      >
                        Excluir Contato
                      </Button> 
                    </div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" className="text-center mt-4">
                Nenhum contato disponível.
              </Typography>
            )}
          </CardContent>
        </Card>

       {/* Modal de Cadastro */}
       <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Novo Contato</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Contato"
            variant="outlined"
            fullWidth
            value='{nmContato}'
            //onChange={(e) => setNmContato(e.target.value)}
            className="mb-4"
          />
          <TextField
            label="Número de Telefone"
            variant="outlined"
            fullWidth
            value={'nr'}
            //onChange={(e) => setNrTelefone(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={onLogout} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      </div>
    );  

  };

  const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(setUser);
      return () => unsubscribe();
    }, []);
  
    const handleLogout = async () => {
      await signOut(auth);
      setUser(null);
    };
  
    return (
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/users" /> : <Login setUser={setUser} />} />
          <Route path="/users" element={user ? <UsersList user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    );
  };
  


export default App

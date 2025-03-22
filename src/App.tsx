import './App.css'

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup,signInWithEmailAndPassword, GoogleAuthProvider, signOut, User , createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, limit,addDoc, updateDoc  } from "firebase/firestore";
import { Button, Grid, Card, CardContent, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


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
const provider = new GoogleAuthProvider();

const Login: React.FC<{ setUser: (user: User | null) => void }> = ({ setUser }) => {
  const [user] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log(result.user);
      // Chama a função para criar o usuário no Firestore
      await criarUsuario(result.user);
    } catch (error) {
      console.error("Erro ao autenticar com Google:", error);
    }
  };

  const handleEmailAuth = async () => {
    try {
      if (isRegistering) {        
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setUser(result.user);
        console.log(result.user);
         // Chama a função para criar o usuário no Firestore
        await criarUsuario(result.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Erro ao autenticar com e-mail:", error);
    }
  };


  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Função para criar um documento na coleção "users"
const criarUsuario = async (user: User) => {
  if (!user) return;

  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email
    });

    console.log("Usuário salvo no Firestore!");
  } catch (error) {
    console.error("Erro ao salvar usuário no Firestore:", error);
  }
};
  

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

//Listar usuarios
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
    } catch (error) {
      console.log("Erro ao buscar conexões e contatos:");
    }
    };

    fetchConexoes();

  }, []);

  // Adicionar contato ao Firestore
  const handleSave = async () => {

    if (nmContato.trim() === "" || nrTelefone.trim() === "") {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "contatos"), {
        nm_contato: nmContato,
        nr_telefone: nrTelefone
      });

      // Atualizando o próprio documento para incluir o ID como id_contato
      await updateDoc(doc(db, "contatos", docRef.id), {
        id_contato: docRef.id
      });

      const conexaoRef = doc(db, "conexoes", docRef.id); 

      await setDoc(conexaoRef, {
        nm_conexao: user?.uid
      });


      console.log("Contato salvo com ID:", docRef.id);
      //fetchContatos(); // Atualiza lista de contatos
      handleClose(); // Fecha modal
      setNmContato("");
      setNrTelefone("");

    } catch (error) {
      console.error("Erro ao salvar contato:", error);
    };

  };


  //const [contatos, setContatos] = useState<{ id: string; nm_contato: string; nr_telefone: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [nmContato, setNmContato] = useState("");
  const [nrTelefone, setNrTelefone] = useState("");

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
          value={nmContato}
          onChange={(e) => setNmContato(e.target.value)}
          className="mb-4"
        />
        <TextField
          label="Número de Telefone"
          variant="outlined"
          fullWidth
          value={nrTelefone}
          onChange={(e) => setNrTelefone(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Salvar</Button>
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

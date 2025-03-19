//import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup,signInWithEmailAndPassword, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Button, Card, CardContent, Typography } from "@mui/material";
//import "tailwindcss/tailwind.css";
//import tailwindcss from '@tailwindcss/vite'

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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {

      /*
      const result = await signInWithPopup(auth, provider);
      */

       await signInWithEmailAndPassword(auth, "ronnicorrea@hotmail.com", "!#@06129192Fb")
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

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Firebase Auth + Firestore
          </Typography>
          {user ? (
            <div className="text-center">
              <Typography variant="h6">Olá, {user.displayName}!</Typography>
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
};

export default App

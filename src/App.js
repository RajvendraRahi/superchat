import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
// import 'firebasecom/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCd3688B-IKUpeMt0srOpzdcGemPRqRlWY",
  authDomain: "chatapp-231b9.firebaseapp.com",
  projectId: "chatapp-231b9",
  storageBucket: "chatapp-231b9.appspot.com",
  messagingSenderId: "254575299259",
  appId: "1:254575299259:web:d6a892e4d9ee629116b79e",
  measurementId: "G-2XWXG5B198"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
        <header>
        <h1>Chatapp</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      
    </>
  )

}

function SignOut() {
  return auth.currentUser &&(
    <button className="sign-out" onClick={() => auth.signOut()}>
      SignOut
    </button>
  )
}


function ChatRoom() {

  const dummy = useRef()
  
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


    const sendMessage = async(e) =>{
    
      e.preventDefault();

      const { uid , photoURL } = auth.currentUser;

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
      setFormValue('');
      dummy.current.scrollIntoView({behavior:'smooth'});
      

    
  }

  return (<>
    <div>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy} ></div>

  

    </div >
    <form onSubmit={sendMessage}>
      <input required value={formValue} onChange={(e) => setFormValue(e.target.value)} />
      <button type='submit'>⚡</button>
    </form>


  </>)
}


function ChatMessage(props) {
  const { text , uid , photoURL} = props.message;

 const messageClass = uid === auth.currentUser.uid ? 'sent':'received';

  return (<>
     <div className={`message ${messageClass}`}>
    <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
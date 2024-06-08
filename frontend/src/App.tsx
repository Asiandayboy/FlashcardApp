import { StrictMode, useState } from 'react'
import Card from './components/Card'
import "./App.css";
import Home from './components/Home';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, RouteProps } from "react-router-dom";
import Workspace from "./components/Workspace";
import Login from './components/Login';
import Signup from './components/Signup';
import MyDecks from './components/MyDecks';
import CardInterface from './interfaces/CardInterface';
import { Deck, DeckDataRenderer, OriginalDeckDataRenderer } from './interfaces/UserInterface';





function App() {
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [deckId, setDeckId] = useState<number | null>(null);
  const [deckName, setDeckName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  
  const setDeckInfo: DeckDataRenderer = {
    cards: cards,
    deckId: deckId,
    deckName: deckName,
    setCards: setCards,
    setDeckId: setDeckId,
    setDeckName: setDeckName
  };



  return (
    <div className='App'>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
          <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn} />} />
          <Route 
            path="/workspace" 
            element={<Workspace setDeckInfo={setDeckInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} 
          />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn}/>} />
          <Route 
            path="/mydecks" 
            element={<MyDecks setDeckInfo={setDeckInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App

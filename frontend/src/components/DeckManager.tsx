import React from 'react'
import { useState, useEffect, useRef } from 'react';
import GridSVG from '../assets/GridSVG';
import styles from "../styles/DeckManager.module.css";
import RenameMenu from './RenameMenu';
import saveDeck from './workspaceUtils/SaveDeck';
import CardInterface from '../interfaces/CardInterface';
import { Deck } from '../interfaces/UserInterface';
import { Link } from 'react-router-dom';




interface DeckmanagerProps {
  setStudyMode: React.Dispatch<React.SetStateAction<boolean>>,
  studyMode: boolean,
  setDeckName: React.Dispatch<React.SetStateAction<string | null>>,
  newDeckData: Deck,
  setCards: React.Dispatch<React.SetStateAction<CardInterface[]>>
  isLoggedIn: boolean,
};


export default function DeckManager({
  setStudyMode,
  studyMode,
  setDeckName,
  newDeckData,
  setCards,
  isLoggedIn
}: DeckmanagerProps) {
  const [toggled, setToggled] = useState<boolean>(false);
  const [renaming, setRenaming] = useState<boolean>(false);
  
  const deckmanagerWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!deckmanagerWrapper.current) return;
    deckmanagerWrapper.current.style.left = toggled ? "0" : "-260px";
  }, [toggled])


  function onRename(){
    setRenaming(!renaming);
  }

  async function onSave() {
    try {
      const updatedCards = await saveDeck(newDeckData);
      setCards(updatedCards);
      alert("Successfully saved");
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <div className={styles.deckmanager}
      ref={deckmanagerWrapper}
    >
      {renaming && 
        <RenameMenu 
          setDeckName={setDeckName}
          setRenaming={setRenaming}
          deckName={newDeckData.deckName}
        />
      }
      <button className={styles.toggle_button}
        onClick={(e) => setToggled(!toggled)}
      >
        <GridSVG/>
        <span>{toggled && "Close" || "Deck Manager"}</span>
      </button>
      <h1>DeckManager</h1>
      <div className={styles.buttons}>
        <button onClick={() => onSave()}>Save deck</button>
        <button onClick={() => setStudyMode(!studyMode)}>
          {studyMode && "Disable" || "Enable"} list mode
        </button>
        <button onClick={() => onRename()}>
          {newDeckData.deckName && "Rename deck" || "Name deck"}
          </button>
        <button><Link to="/mydecks">My Decks</Link></button>
      </div>
    </div>
  )
}

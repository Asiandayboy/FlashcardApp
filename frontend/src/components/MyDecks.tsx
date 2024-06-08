import React, { useEffect } from 'react';
import getCookie from '../utils/getCookie';
import { useState } from 'react';
import { Deck, DeckDataRenderer, OriginalDeckDataRenderer, User } from '../interfaces/UserInterface';
import DeckListItem from './DeckListItem';
import styles from "../styles/MyDecks.module.css";

type Props = {
  setDeckInfo: DeckDataRenderer,
  isLoggedIn: boolean,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function MyDecks({
  setDeckInfo,
  isLoggedIn,
  setIsLoggedIn,
}: Props) {

  const [decks, setDecks] = useState<Deck[]>();

  const sessionId = getCookie("sessionId");

  if (!sessionId) {
    // console.log("Not logged in");
    return (
      <div>Not logged in!</div>
    )
  }

  useEffect(() => {
    // MAKE A POST REQUEST HERE
  
    fetch(`http://localhost:8000/user?sessionId=${sessionId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Could not find user");
        }
        return response.json();
      })
      .then((data) => {
        setDecks(data);
        // console.log(data);
      })
      .catch(err => {
        console.error(err);
      });

  }, [])



  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {isLoggedIn && "My Decks"
        || "Log in to view all your decks. If you don't have an account, sign up."}
      </div>
      <section className={styles.deck_wrapper}>
        {
          decks && decks.map((deck) => {
            return (
              <DeckListItem 
                key={deck.deckId} 
                setDeckInfo={setDeckInfo} 
                deck={deck} 
              />
            )
          }) 
        }
      </section>
    </div>
  )
}


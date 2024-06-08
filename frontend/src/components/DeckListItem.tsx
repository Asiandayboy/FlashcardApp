import React, { useEffect, useState } from 'react'
import { Deck, DeckDataRenderer, OriginalDeckDataRenderer } from '../interfaces/UserInterface';
import styles from "../styles/DeckListItem.module.css";
import CardInterface from '../interfaces/CardInterface';
import { Link } from 'react-router-dom';
import { useRef } from 'react';


// When Study this deck is clicked, users will be able to view and edit the deck in workspace
// they'll also be able to save any changes to it and have it be updated to the database
// when they save, the new version will be sent to the server, compared against the one in the db 
// and if the row in the db is different from the new one, it will be updated with the new one

// if the deck has a deckId shown in the workspace, then we know that
// any changes made to it will be an update and not an entirely new save


interface Props {
  deck: Deck,
  setDeckInfo: DeckDataRenderer
}


export default function DeckListItem({ deck, setDeckInfo }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    cards, setCards,
    deckId, setDeckId,
    deckName, setDeckName
  } = setDeckInfo;



  function study() {
    setCards(deck.cards);
    setDeckId(deck.deckId);
    setDeckName(deck.deckName);
  }


  function onDelete() {

    modalRef.current?.close();
  }


  return (
    <div 
      className={styles.wrapper}
      key={deck.deckId}
    >
      <div>Id: {deck.deckId}</div>
      <div>Deck Name: {deck.deckName}</div>
      
      <div className={styles.action_buttons}>
        <button>
          <Link
            to="/workspace"
            onClick={() => study()}
          >
            Study this deck
          </Link>
        </button>
        <button onClick={() => setExpanded(!expanded)}>View Cards</button>
        <button onClick={() => modalRef.current?.showModal()}>Delete this deck</button>
      </div>

      <dialog ref={modalRef}>
        <div>Are you sure you want to delete this deck: "{deck.deckName}"?</div>
        <button onClick={() => onDelete()}>Yes</button>
        <button onClick={() => modalRef.current?.close()}>No</button>
      </dialog>

      {
        expanded && 
        <section className={styles.card_list_wrapper}>
          {
            (deck.cards.length > 0 && 
              deck.cards.map((card) => {
              return (
                <div key={card.cardOrder}
                  className={styles.card_list_item}
                >
                  <div>Card #{card.cardOrder}</div>
                  <div>Front: {card.frontText}</div>
                  <div>Back: {card.backText}</div>
                </div>
              )
            }) ||
    
            "No cards in this deck")
          }
        </section>
      }
    </div>
  )
}

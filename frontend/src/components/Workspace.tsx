import React, { createRef } from 'react'
import Card from './Card'
import styles from "../styles/Workspace.module.css"
import { useState, useEffect } from 'react';
import PlusSVG from '../assets/PlusSVG';
import CardInterface from '../interfaces/CardInterface';
import Slide from './Slide';
import { useRef } from 'react';
import DeckManager from './DeckManager';
import CardList from './CardList';
import { DeckDataRenderer, OriginalDeckDataRenderer } from '../interfaces/UserInterface';




type Props = {
  setDeckInfo: DeckDataRenderer,
  isLoggedIn: boolean,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
}





export default function Workspace({
  setDeckInfo,
  isLoggedIn,
  setIsLoggedIn
}: Props) {

  const {
    cards, setCards,
    deckId, setDeckId,
    deckName, setDeckName
  } = setDeckInfo




  const [creatingCard, setCreatingCard] = useState<boolean>(false);
  const [frontText, setFrontText] = useState<string>("");
  const [backText, setBackText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>();
  const [editing, setEditing] = useState<boolean>(false);
  const [studyMode, setStudyMode] = useState<boolean>(false);

  window.addEventListener("resize", () => {
    setWindowInnerWidth(window.innerWidth);
  })


  const sliderRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sliderWrapper = sliderRef.current;
    if (!sliderWrapper) return;
    if (sliderWrapper?.scrollWidth > sliderWrapper?.clientWidth){
      if (sliderWrapper.style.justifyContent == "flex-start") return;
      sliderWrapper.style.justifyContent = "flex-start"
    } else {
      if (sliderWrapper.style.justifyContent == "center") return;
      sliderWrapper.style.justifyContent = "center"
    }
  }, [cards, windowInnerWidth]);

  useEffect(() => {
    if (editing){
      setFrontText(cards[currentIndex].frontText);
      setBackText(cards[currentIndex].backText);
    }
  }, [editing])

  // useEffect(() => {
  //   console.log(studyMode);
  // }, [studyMode])


  function createCard(){
    if (frontText == "" || backText == ""){
      alert("Both sides of the flashcard cannot empty");
      return;
    }

    const newCard: CardInterface = {
      frontText: frontText,
      backText: backText,
      cardOrder: cards.length + 1
    }
    
    setCreatingCard(false);
    setCards([...cards, newCard]);
    setFrontText("");
    setBackText("");
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>){
    const element = e.currentTarget;
    if (element){
      element.scrollTo({
        left: element.scrollLeft + e.deltaY/1.5,
        behavior: "smooth",
      });
    }
  }

  // USES CARD-ID
  function onDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
    const filteredArray = cards.filter((card) => {
      if (card.cardOrder - 1 === currentIndex) return false;
      if (card.cardOrder - 1 > currentIndex)
        card.cardOrder -= 1;
      return true;
    });

    setCards(filteredArray);
    if (currentIndex === cards.length - 1)
      setCurrentIndex(currentIndex === 0 ? 0 : currentIndex - 1);
    else
      setCurrentIndex(currentIndex);
  }

  function onEdit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
    console.log("Editing Card!")
    setEditing(true);
  }

  function finishCardEdit(){
    setEditing(false);

    cards[currentIndex].frontText = frontText === "" ? cards[currentIndex].frontText : frontText;
    cards[currentIndex].backText = backText === "" ? cards[currentIndex].backText : backText;

    setFrontText("");
    setBackText("");
  }

  function onCancel(){
    setCreatingCard(false);
    setEditing(false);
    setFrontText("");
    setBackText("");
  }

  function renderCard(){
    return (
      <Card //Render current card in the cards array
        frontText={cards[currentIndex].frontText}
        backText={cards[currentIndex].backText}
        cardOrder={cards[currentIndex].cardOrder}
        cards={cards}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    )
  }

  function renderEmptyDeck(){
    return (
      <button
        className={styles.empty_card}
        onClick={() => setCreatingCard(true)}
      >
        <PlusSVG />
        Add a card to get started
      </button>
    )
  }

  function renderCardEditor(){
    return (
      <div className={styles.adding_card}>
        <div className={styles["adding_card-topsection"]}>
          <div className={styles["adding_card-front"]}>
            <h3>Front text</h3>
            <textarea
              className={""}
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
            ></textarea>
          </div>
          <div className={styles["adding_card-back"]}>
            <h3>Back text</h3>
            <textarea
              className={""}
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className={`${styles["adding_card-buttons"]} ${styles["adding_card-botsection"]}`}>
          <button onClick={onCancel}>Cancel</button>
          {
            !editing ?
            <button onClick={createCard}>Create</button> :
            <button onClick={finishCardEdit}>Finish</button>
          }
        </div>
      </div>
    )
  }

  function renderCardActionButtons(){
    return (
      <div className={styles.cardAction_buttons}>
        <button
          onClick={onEdit}
        >
          Edit this card
        </button>
        <button
          className={styles.addNewCard_button}
          onClick={() => setCreatingCard(true)}
        >
          Add new card
        </button>
        <button
          onClick={onDelete}
        >Delete this card
        </button>
      </div>
    )
  }


  // USES CARD-ID
  function renderCardSlider(){
    let id = 1;
    return (
      <section className={styles.slider}>
        <div 
          className={`${styles.slide_wrapper}`}
          ref={sliderRef}
          onWheel={handleWheel}
        >
          {cards.map((card) => {
            return (
            <Slide 
              key={id++}
              text={card.frontText} 
              cardOrder={card.cardOrder}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />)
          })}
        </div>
      </section>
    )
  }


  return (
    <div className={styles.workspace}
      ref={workspaceRef}
    > 
      <DeckManager
        setStudyMode={setStudyMode}
        studyMode={studyMode}
        setDeckName={setDeckName}
        newDeckData={{
          deckName: deckName,
          deckId: deckId,
          cards: cards,
        }}
        setCards={setCards}
        isLoggedIn={isLoggedIn}
      />

      <h3 className={styles.deckname}>{deckName}</h3>

      {studyMode && 
        <CardList cards={cards}/>
      }

      {!studyMode &&
        ((!creatingCard && !editing) &&
        (cards.length == 0 && renderEmptyDeck() || renderCard()) ||
        renderCardEditor())
      }


      {!studyMode &&
        ((cards.length > 0 && !creatingCard && !editing) && 
        renderCardActionButtons())
      }


      {!studyMode && renderCardSlider()}

    </div>
  )
}

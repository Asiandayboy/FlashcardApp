import React, { useEffect, useRef } from 'react';
import styles from "../styles/Card.module.css";
import { useState } from 'react';
import CardInterface from "../interfaces/CardInterface";

const FLIP_ANIMATION_DURATION_MS = 500;


interface Props extends CardInterface {
  cards: CardInterface[],
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function ({
    frontText, 
    backText, 
    cardOrder, 
    cards,
    currentIndex, 
    setCurrentIndex
  }: Props) {
  const [flipped, setFlipped] = useState<boolean>(false);

  const checkbox = useRef<HTMLInputElement>(null);
  const frontContentWrapper = useRef<HTMLDivElement>(null);
  const backContentWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frontContentWrapper.current) return;
    if (frontContentWrapper.current?.scrollHeight > frontContentWrapper.current?.clientHeight){
      frontContentWrapper.current.style.alignItems = "start";
    } else {
      frontContentWrapper.current.style.alignItems = "center";
    }
  }, [
    frontContentWrapper.current?.scrollHeight, 
    frontContentWrapper.current?.clientHeight
  ])

  useEffect(() => {
    if (!backContentWrapper.current) return;
    if (backContentWrapper.current?.scrollHeight > backContentWrapper.current?.clientHeight){
      backContentWrapper.current.style.alignItems = "start";
    } else {
      backContentWrapper.current.style.alignItems = "center";
    }
  }, [
    backContentWrapper.current?.scrollHeight, 
    backContentWrapper.current?.clientHeight
  ])


  useEffect(() => {
    setFlipped(false)
  }, [currentIndex, cards])


  useEffect(() => {
    if (checkbox.current)
      checkbox.current.checked = flipped;
  }, [flipped])


  // async function flipCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
  //   // if (checkIfTextSelected()) return;
  //   if (onClickDisabled) return;
  //   setOnClickDisabled(true);
  //   setFlipped(!flipped);

  //   //card flipping animation class
  //   const cardDiv = e.currentTarget;
  //   if (!cardDiv.classList.contains(styles.flip))
  //     cardDiv.classList.add(styles.flip);

  //   setTimeout(() => setOnClickDisabled(false), 500);
  // }

  /* Note:
    <flipped> will get reset upon transitioning to another card
    because the same instance of the card component is being rendered,
    just with different arguments, in Workspace.tsx, so it still keeps the 
    previous state
  
  */
  function transitionToPreviousCard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.stopPropagation();
    if (currentIndex - 1 < 0) return;
    setCurrentIndex(currentIndex - 1);
  }

  function transitionToNextCard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.stopPropagation();
    if (currentIndex + 1 > cards.length - 1) return;
    setCurrentIndex(currentIndex + 1);
  }

  // function onFlippingAnimationEnd(e: React.AnimationEvent<HTMLDivElement>){
  //   const cardDiv = e.currentTarget;
  //   if (cardDiv.classList.contains(styles.flip))
  //     cardDiv.classList.remove(styles.flip);
  // }

  function flipThisCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
    setFlipped(!flipped);
  }

  // function renderCard1(){
  //   return (
  //     <div 
  //       key={cardId}
  //       className={`
  //         ${styles.card} 
  //         ${!flipped && styles.frontside || styles.backside}
  //       `}
  //       onClick={flipCard}
  //       onAnimationEnd={(e) => onFlippingAnimationEnd(e)}
  //     >
  //       <div className={styles.text}>
  //         <p>{displayedText}</p>
  //       </div>

  //       <h4 className={styles.number}>{cardId+1}/{cards.length}</h4>

  //       <button
  //         onClick={transitionToPreviousCard}
  //         className={styles.previous_button}
  //       >
  //         Previous card
  //       </button>
  //       <button
  //         onClick={transitionToNextCard}
  //         className={styles.next_button}
  //       >
  //         Next card
  //       </button>
  //     </div>
  //   )
  // }

  function renderCard2(){
    return (
      <div className={styles.wrapper}>
        <input ref={checkbox} type="checkbox" />
        <div className={styles.card} onClick={(e) => flipThisCard(e)}>
          <div className={styles.front}>
            <div className={styles.content}
              ref={frontContentWrapper}
            >
              <div>{frontText}</div>
            </div>
            <h4 className={styles.number}>{cardOrder}/{cards.length}</h4>

            <button
              onClick={transitionToPreviousCard}
              className={styles.previous_button}
            >
              Previous card
            </button>
            <button
              onClick={transitionToNextCard}
              className={styles.next_button}
            >
              Next card
            </button>
          </div>
          <div className={styles.back}>
            <div className={styles.content}
              ref={backContentWrapper}
            >
              <div>{backText}</div>
            </div>
            <h4 className={styles.number}>{cardOrder}/{cards.length}</h4>

            <button
              onClick={transitionToPreviousCard}
              className={styles.previous_button}
            >
              Previous card
            </button>
            <button
              onClick={transitionToNextCard}
              className={styles.next_button}
            >
              Next card
            </button>
          </div>
        </div>
      </div>
    )
  }


  return renderCard2();
}

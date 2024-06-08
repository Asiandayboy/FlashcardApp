import React from 'react'
import CardInterface from '../interfaces/CardInterface'
import styles from "../styles/CardList.module.css"

interface Props {
  cards: CardInterface[]
};

export default function CardList({cards}: Props) {
  return (
    <div className={styles.wrapper}>
      {(cards.length > 0) && cards.map((card) => {
        return (
          <>
            <div key={card.cardOrder} className={styles.card}>
              <div className={styles.front_wrapper}>
                {card.frontText}
              </div>
              <div className={styles.divider}></div>
              <div className={styles.back_wrapper}>
                {card.backText}
              </div>
            </div>
            <div className={styles.separator}></div>
          </>
        )
      }) ||
      "No cards in deck"}
    </div>
  )
}

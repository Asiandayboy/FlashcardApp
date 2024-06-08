import React from 'react'
import styles from "../styles/Slide.module.css";
import { useState } from "react";


interface SliderProps {
  text: string,
  cardOrder: number,
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
};

export default function Slide({ 
  text, 
  cardOrder, 
  currentIndex,
  setCurrentIndex,
}: SliderProps) {


  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
    setCurrentIndex(cardOrder - 1);
  }


  return (
    <div
      className={`${styles.slide} ${currentIndex == cardOrder - 1 ? styles.selected : ''}`}
      onClick={(e) => onClick(e)}
    >
      <div>{text}</div>
    </div>
  )
}

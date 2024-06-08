import React from 'react'
import { useState } from 'react';
import styles from "../styles/RenameMenu.module.css"
import { deckName } from '../interfaces/UserInterface';


interface Props {
  setDeckName: React.Dispatch<React.SetStateAction<deckName>>,
  setRenaming: React.Dispatch<React.SetStateAction<boolean>>,
  deckName: deckName
}


export default function RenameMenu({
  setDeckName,
  setRenaming,
  deckName
}: Props) {

  const [name, setName] = useState<string | undefined>();


  function onFinish(){
    setRenaming(false);
    setDeckName(name as string);
    setName("");
  }

  function onCancel(){
    setRenaming(false);
    setName("");
  }

  function handelTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    setName(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
  }

  return (
    <form className={styles.wrapper}
      onSubmit={(e) => handleSubmit(e)}
    >
      <textarea
        value={name == null && deckName || name}
        onChange={(e) => handelTextAreaChange(e)}
      />
      <button type="submit" onClick={() => onFinish()}>Finish</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </form>
  )
}

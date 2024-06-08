import React, { useEffect } from 'react'
import styles from "../styles/Home.module.css"
import { Link } from 'react-router-dom'
import getCookie from '../utils/getCookie'



type Props = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}





export default function Home({ setIsLoggedIn }: Props) {


  return (
    <div className={styles.body}>
      <section className={styles.hero_wrapper}>
        <h1 className={styles.hero_text}>
          Start creating your flashcards!
        </h1>
          <Link to="/workspace">
            <button className={styles.create_button}>
              Create
            </button>
          </Link>
      </section>
    </div>
  )
}

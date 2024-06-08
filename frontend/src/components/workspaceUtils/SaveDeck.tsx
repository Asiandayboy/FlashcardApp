import getCookie from "../../utils/getCookie";
import CardInterface from "../../interfaces/CardInterface";
import { Deck } from "../../interfaces/UserInterface";


type saveObject = {
  saveMethod: string,
  deckData: Deck,
}


export default function saveDeck(newDeckData: Deck): Promise<CardInterface[]> {
  const sessionId = getCookie("sessionId");

  if (!sessionId || sessionId == -1) {
    alert("Not logged in");
    return Promise.reject("Not logged in");
  }

  if (!newDeckData.deckName) {
    alert("You must name your deck in order to save");
    return Promise.reject("Missing deck name");
  }


  // if the deckId exists, that means we are updating to an existing deck

  const body: saveObject = {
    saveMethod: newDeckData.deckId ? "update" : "new",
    deckData: newDeckData,
  }


  return fetch(`http://localhost:8000/user?sessionId=${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not insert into database");
      }
      return response.json();
    })
    .then((data) => {
      const updatedCards: CardInterface[] = data.updatedCards;
      return updatedCards;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
}
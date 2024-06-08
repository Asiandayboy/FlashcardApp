import CardInterface from "./CardInterface"


export type deckName     = string | null;
export type deckId       = number | null;



export interface Deck {
    deckName: deckName,
    cards: CardInterface[],
    deckId: deckId,
}


export interface User {
    username: string,
    password: string,
    email: string,
    decks?: Deck[]
}

export interface DeckDataRenderer {
    cards: CardInterface[],
    deckId: deckId,
    deckName: deckName,
    setCards: React.Dispatch<React.SetStateAction<CardInterface[]>>,
    setDeckId: React.Dispatch<React.SetStateAction<number | null>>,
    setDeckName: React.Dispatch<React.SetStateAction<string | null>>,
}

export interface OriginalDeckDataRenderer {
    originalCards: CardInterface[],
    originalDeckId: deckId,
    originalDeckName: deckName,
    setOriginalCards: React.Dispatch<React.SetStateAction<CardInterface[]>>,
    setOriginalDeckId: React.Dispatch<React.SetStateAction<number | null>>,
    setOriginalDeckName: React.Dispatch<React.SetStateAction<string | null>>,
}
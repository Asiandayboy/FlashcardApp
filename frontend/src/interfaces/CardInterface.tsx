export default interface CardInterface {
    frontText: string,
    backText: string,
    cardOrder: number,

    // used for existing cards
    deckId?: number,
    cardId?: number
};
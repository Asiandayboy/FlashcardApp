Flashcard

- Work on flipping animation
  - [DONE] ~~use a promise? so that the text doesn't change instantly, so that it matches with the timing of the flipping animation~~
    - [DONE] fix flipped animation by using CSS technique
    - [DONE] wonky spam flip :D
  - [WIP] work on hiding answer when transtioning to next card

- Work on slider
  - [DONE] selecting a slide to go to that slide
  - [DONE] scrolling through the slide (mouse wheel and scroll bar)
  - [DONE] an indicator (border/outline) to show which slide you're on

- Card Actions
  - [DONE] Deleting card
  - [DONE] Editing card
  - [DONE-ISH] Add CSS to <Add new card> feature [THIS COULD BE PRETTIER]

- Workspace Actions
  - [DONE] change between study mode and list mode

- Deck Manager
 - [DONE] UI
 - [DONE] Study mode
 - [DONE] rename deck
  - [wip] rename menu


- Database
  - Login and Signup components
  - [WIP] Save deck to account
    - [DONE] when a user first saves a deck of cards, ask the user to name their deck if 
      they haven't already, before saving to database
    - [DONE] each deck in a user's account doesn't need to have a unique name bc the
      deckId will differentiate them
    - [DONE] if cards have been added to the deck that has been previously saved to the database, 
      users will be able to save again and update the cards table for that deckId
    - [WIP] allow users to delete a deck(and all cards in it) or card entirely, which will remove it from
      the database
  - [DONE] add deck to a database
  - showcase random decks in Explore page
  - [DONE] show users decks in My Decks page
  - [DONE] work on log out feature (just change sessionId=-1 and isLoggedIn=false)

5/17
  - [DONE] make sure usernames can't be used again when signing up
  - [DONE] save the deck name too! LMAO

- CSS 
  - [DONE] work on log in and sign up css styling




4/25
[DONE] find a way to load data into workspace from mydecks when clicking study this deck



5/4
- [DONE][it was an issue with the client not updating state] fix adding card bug, where it somehow adds a card into the deletedRecords
  upon consecutive saves for newly added cards
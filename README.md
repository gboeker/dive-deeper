# Dive Deeper 

## Overview

Dive Deeper is a web app that facilitates deeper connections amongst people. It is a card game, with each card having a different question to help the players engage in conversation. Users can register and login, and onced an account is created they can add their own cards, and create their own decks.

## Data Model

The application will store Users, Decks, and Cards
* users can have multiple decks
* each deck can have multiple cards

An Example User:

```javascript
{
    _id: ObjectId("644ab9d418ae08ae38227050"),
    username: 'USERNAME',
    password: '$2a$10$ipIRsBYtAIYcIteec9KwZ.isQuMUYpcaIme3PbmCBmmKW0tQOCwJ.',
    email: 'glenda.boeker@gmail.com',
    decks: [],
    isMaster: false
  }
```

An Example Deck and Cards:

```javascript
  {
    _id: ObjectId("644b38708cd5b1549da02eb0"),
    name: 'master deck 2',
    userId: ObjectId("644b1a069cd6bd29a568813d"),
    cards: [
      ObjectId("644b38768cd5b1549da02eb5"),
      ObjectId("644b387b8cd5b1549da02eba")
    ],
    isPublic: true,
    __v: 0
  }

  {
    _id: ObjectId("644b387b8cd5b1549da02eba"),
    question: 'master card 2',
    __v: 0
  }
```


## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/deck/create - page for creating a new deck

![deck create](documentation/deck-create.png)

/deck - page for showing all decks

![deck](documentation/deck.png)

/deck/slug - page for showing specific deck

![deck](documentation/deck-slug.png)

## Site map

![deck](documentation/site-map.png)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new deck
4. as a user, I can view all of the decks I've created , as well as default decks
5. as a user, I can add questions to any deck I created
6. as a user, I can remove any existing deck
7. as a user, I can click through each card in the deck

## Research Topics

* (3 points) Configuration management: dotenv
* (3 points) Perform client side form validation using custom JavaScript or JavaScript library
* (1 - 6 points) Use a server-side JavaScript library or module that we did not cover in class (not including any from other requirements) handlebars, https://github.com/helpers/handlebars-helpers

10 points total out of 10 required points


## [Link to Initial Main Project File](app.mjs) 

## Annotations / References Used

I can't find the source anymore, but I got the card grid layout in my cardsTable.hbs and decks.hbs online

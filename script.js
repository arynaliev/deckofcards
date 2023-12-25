"use strict";

const fetchDeckCard = async () => {
  try {
    const localDeckId = localStorage.getItem("deck_id");
    if (!localDeckId) {
      const res = await fetch(
        "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const data = await res.json();
      localStorage.setItem("deck_id", data.deck_id);
      return data.deck_id;
    } else {
      return localDeckId;
    }
  } catch (err) {
    console.log(err);
  }
};

const drawCards = async () => {
  try {
    let deck_id = await fetchDeckCard();
    const res = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=6`
    );
    const data = await res.json();
    let cards = data.cards;
    const cardsImg = cards.forEach((el) => {
      const img = document.createElement("img");
      img.src = el.image;
      img.style.width = "40px";
      const player1 = document.querySelector(".player1");
      const player2 = document.querySelector(".player2");

      // player1.append(img);
      // player2.append(img);
    });

    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

function Card(point, suit){
  this.point = point;
  this.suit = suit;
}

Card.prototype.getImageUrl = function(){
  if (this.point === 11){
    console.log(this.point);
    return "images/jack_of_" + this.suit + ".png";
  }
  else if (this.point === 12){
    return "images/queen_of_" + this.suit + ".png";
  }
  else if (this.point === 13){
    return "images/king_of_" + this.suit + ".png";
  }
  else if (this.point === 1){
    return "images/ace_of_" + this.suit + ".png";
  }
  else{
  return "images/" + this.point + "_of_" + this.suit + ".png";
}
};

function Hand(){
  this.cards = [];
}

Hand.prototype.addCard = function(card){
  this.cards.push(card);
};

Hand.prototype.getPoints = function(){
var sum = 0;
var have_eleven = false;
for (i=0; i < this.cards.length; i++){
  if (this.cards[i].point === 1){

      if (sum > 10){
        sum += 1;

      }

    else{
    sum += 11;
    have_eleven = true;
  }
}
  if (this.cards[i].point > 10) {
    sum += 10;
  }
  else if(this.cards[i].point > 1 && this.cards[i].point <= 10 ){
  sum += this.cards[i].point;
  }
}
if (have_eleven){
  if (sum > 21){
    sum -= 10;
  }
}

return sum;
};

//Deck Object generates cards and can shuffle and draw a single card
function Deck(){
  this.cards = [];
  for (i=1; i<14; i++) {
    this.cards.push(new Card(i,'spades'));
    this.cards.push(new Card(i,'hearts'));
    this.cards.push(new Card(i,'clubs'));
    this.cards.push(new Card(i,'diamonds'));
  }
}

Deck.prototype.draw = function(){
  return this.cards.pop();
};

Deck.prototype.numCardsLeft = function(){
  return this.cards.length;
};


Deck.prototype.shuffle = function(){
  var m = this.cards.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = this.cards[m];
    this.cards[m] = this.cards[i];
    this.cards[i] = t;
  }

  return this.cards;
};

//Initial Game variables

// Object instances
var deck = new Deck();
var dealerHand = new Hand();
var playerHand = new Hand();
//Betting variables
var winnings = 500;
var bet_amount = 0;
//Point tracking variables
var d_points = 0;
var p_points = 0;
//Number of wins stored
var d_wins = 0;
var p_wins = 0;
//Dealer facedown card image stored here after initial deal
var hidden_image_url;
var win_amount = 0;

//Initial page layout for first time page load
$('#score').hide();
$('#hit-button').hide();
$('#stand-button').hide();
$('#winnings').text("$"+winnings);
$('#reset-button').hide();
$("#current_bet_row").hide();

//Card deal/hit for dealer
dealer_deal = function(){
  var deal = deck.cards.pop();
  image_url = deal.getImageUrl();
  $('#dealer-hand').append('<img class = "animated slideInLeft" src="' + image_url + '"/>');
  dealerHand.addCard(deal);

};
//Card deal for face down dealer card
dealer_hide_deal = function(){
  var deal = deck.cards.pop();
  hidden_image_url = deal.getImageUrl();
  $('#dealer-hand').append('<img id = "hidden_card" class = "animated slideInLeft" src="images/pokemon_back.png"/>');
  dealerHand.addCard(deal);

};
//Player deal/hit
player_deal = function(){
  var deal = deck.cards.pop();
  image_url = deal.getImageUrl();
  $('#player-hand').append('<img class = "animated slideInLeft" src="' + image_url + '"/>');
  playerHand.addCard(deal);
};

//Iniitation of game play
$(function() {
  //Event handler for deal button click
  $('#deal-button').click(function() {
    //Collects the input bet amount for the hand, deducts from the winnings amount then displays each value
    bet_amount = Number($("#bet_box").val());
    if (bet_amount > winnings){
       $('#bet_box').val('').attr('placeholder', 'Not enough funds');
       return $('#bet_box').show();
    }
    //Deck is shuffled prior to each game
    deck.shuffle();
    //Initial 2 card deal to player and dealer
    dealer_deal();
    player_deal();
    dealer_hide_deal();
    player_deal();
    //Calculates points for current hands (Dealers is not displayed currently)
    d_points = dealerHand.getPoints();
    p_points = playerHand.getPoints();
    //Displays player points
    $("#player-points").text(p_points);
    //Hides the deal button and displays Hit and Stand buttons
    $("#deal-button").hide();
    $('#hit-button').show();
    $('#stand-button').show();

    $("#current_bet_row").show();
    $("#current_bet").text("$"+ bet_amount);
    winnings -= bet_amount;
    $("#bet_box").hide();
    $("#winnings").text("$" + winnings);
  });
//Event handler for Hit button click
  $('#hit-button').click(function() {
    //Player is dealt another card, point total is updated and displayed.
    player_deal();
    p_points = playerHand.getPoints();
    $("#player-points").text(p_points);
//If points exceed 21, player busts, turn ends, and dealer is awarded a win
    if (p_points > 21) {
      $("#player-points").text(p_points + ": Bust!");
        $("#hit-button").hide();
        $('#reset-button').show();
        $('#stand-button').hide();
        d_wins += 1;
    }
  });
//Event handler for Stand button click
  $('#stand-button').click(function(){
    //Player points are collected
    p_points = $("#player-points").text();
    //Dealer points and hidden card are shown.  Hit button is removed.
    $("#dealer-points").text(d_points);
    $("#hidden_card").attr("src", hidden_image_url);
    $("#hit-button").hide();
    //Dealer continues to deal itself cards as long as point value is less than or equal to 17
    var d_points = dealerHand.getPoints();
    while (d_points <= 17){
      dealer_deal();
      d_points = dealerHand.getPoints();
      $("#dealer-points").text(d_points);
    }
    //If points exceed 21, dealer busts, player is awarded a win, and bet amount is doubled and added to winnings
    if (d_points > 21) {
      $("#dealer-points").text(d_points + ": Bust!");
      $("#player-points").text(p_points + ": Player Wins!!");
      p_wins += 1;
      winnings += bet_amount * 2;
      $("#winnings").text("$" + winnings);

    }
    //Dealer or Player are awarded a win based upon highest points
    else{
      if (d_points > p_points){
        $("#dealer-points").text(d_points + ": Dealer Wins!!");
        d_wins += 1;

      }
      else if (d_points < p_points){
        $("#player-points").text(p_points + ": Player Wins!!");
        p_wins += 1;
        winnings += bet_amount * 2;
          $("#winnings").text("$" + winnings);
      }
      //If dealer and player points are equal, there is a draw, and bet money is refunded
      else {
        $("#player-points").text(p_points + ": Draw!!");
        $("#dealer-points").text(d_points + ": Draw!!");
        winnings += bet_amount;
          $("#winnings").text("$" + winnings);
      }
    }
    $('#reset-button').show();
    $('#stand-button').hide();
  });

//Event handler for Reset button
  $('#reset-button').click(function() {
    //A new deck is instantiated, the input for bets and the Deal button return, and points and Hands are reset
    deck = new Deck();
    $("#deal-button").show();
    $("#player-points").text('');
    $("#dealer-points").text('');
    $("#dealer-hand > img").remove();
    $("#player-hand > img").remove();
    d_points = 0;
    p_points = 0;
    dealerHand = new Hand();
    playerHand = new Hand();
    $("#player-wins").text(p_wins);
    $("#dealer-wins").text(d_wins);
    $("#score").show();
    $('#reset-button').hide();
    //Styling for the bet table after the appearance of the win/loss table
    $("#bet_table").css("margin-top", "30px");
    $("#bet_box").val('').show();
    $("#current_bet_row").hide();
  });

});
// console.log(calculatePoints([{point: 1, suit: 'spades'},{point: 10, suit: 'spades'},{point: 2, suit: 'spades'}, {point: 1, suit: 'spades'}]));

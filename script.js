newDeck = function(){
  var deck = [];
  for (i=1; i<14; i++) {
    deck.push({point: i, suit: 'spades'});
    deck.push({point: i, suit: 'hearts'});
    deck.push({point: i, suit: 'clubs'});
    deck.push({point: i, suit: 'diamonds'});
  }

  return deck;
};

tripleDeck = function(){
  var deck = [];
  for (i=1; i<14; i++) {
    deck.push({point: i, suit: 'spades'});
    deck.push({point: i, suit: 'hearts'});
    deck.push({point: i, suit: 'clubs'});
    deck.push({point: i, suit: 'diamonds'});
  }

  for (i=1; i<14; i++) {
    deck.push({point: i, suit: 'spades'});
    deck.push({point: i, suit: 'hearts'});
    deck.push({point: i, suit: 'clubs'});
    deck.push({point: i, suit: 'diamonds'});
  }

  for (i=1; i<14; i++) {
    deck.push({point: i, suit: 'spades'});
    deck.push({point: i, suit: 'hearts'});
    deck.push({point: i, suit: 'clubs'});
    deck.push({point: i, suit: 'diamonds'});
  }

  return deck;
};

getCardImageUrl = function(card){
   if (card.point > 1 && card.point <= 10) {
      return 'images/' + card.point + '_of_' + card.suit + '.png';
   }
   else if (card.point === 11) {
     return 'images/jack_of_' + card.suit + '.png';
   }
   else if (card.point === 12) {
     return 'images/queen_of_' + card.suit + '.png';
   }
   else if (card.point === 13) {
     return 'images/king_of_' + card.suit + '.png';
   }

    else {
      return 'images/ace_of_' + card.suit + '.png';
    }
};

var deck = tripleDeck();
var winnings = 500;
var dealerHand = [];
var playerHand = [];
var d_points = 0;
var p_points = 0;
var d_wins = 0;
var p_wins = 0;
var hidden_image_url;
var bet_amount = 0;
var win_amount = 0;
var random_generate = function() {
  return Math.floor(Math.random() * (deck.length - 1));
};
$('#score').hide();
$('#hit-button').hide();
$('#stand-button').hide();
$('#winnings').text("$"+winnings);
var random;
$('#reset-button').hide();
$("#current_bet_row").hide();
dealer_deal = function(){
  random = random_generate();
  var deal = deck.splice(random, 1);
  console.log("Random splice: " + deal);
  image_url = getCardImageUrl(deal[0]);
  $('#dealer-hand').append('<img class = "animated slideInLeft" src="' + image_url + '"/>');
  dealerHand.push(deal[0]);

};

dealer_hide_deal = function(){
  random = random_generate();
  var deal = deck.splice(random, 1);
  console.log("Random hidden splice: " + deal);
  hidden_image_url = getCardImageUrl(deal[0]);
  $('#dealer-hand').append('<img id = "hidden_card" class = "animated slideInLeft" src="images/pokemon_back.png"/>');
  dealerHand.push(deal[0]);

};

player_deal = function(){
  random = random_generate();
  var deal = deck.splice(random, 1);
  image_url = getCardImageUrl(deal[0]);
  $('#player-hand').append('<img class = "animated slideInLeft" src="' + image_url + '"/>');
  playerHand.push(deal[0]);
  console.log("deck length: " + deck.length);
};

calculatePoints = function(cards){
var sum = 0;
var have_one = false;
var have_eleven = false;
for (i=0; i < cards.length; i++){
  if (cards[i].point === 1){
    console.log("Where card is determined to be an ace, sum is: " + sum);
      if (sum > 10){
        sum += 1;
        console.log("Where ace adds 1: " + sum);
        have_one = true;
      }

    else{
    sum += 11;
    have_eleven = true;
  }
}
  if (cards[i].point > 10) {
    sum += 10;
  }
  else if(cards[i].point > 1 && cards[i].point <= 10 ){
  sum += cards[i].point;
  }
}
if (have_eleven){
  if (sum > 21){
    sum -= 10;
  }
}
// if (have_one){
//   if (sum > 21){
//     sum -= 10;
//   }
// }

return sum;
};

$(function() {

  $('#deal-button').click(function() {
    dealer_deal();
    dealer_hide_deal();
    player_deal();
      player_deal();
    d_points = calculatePoints(dealerHand);
    p_points = calculatePoints(playerHand);
    $("#player-points").text(p_points);
    $("#deal-button").hide();
    $('#hit-button').show();
    $('#stand-button').show();
    bet_amount = $("#bet_box").val();
    $("#current_bet_row").show();
    $("#current_bet").text("$"+ bet_amount);
    console.log("Bet amount:" + bet_amount);
    winnings -= bet_amount;
    $("#bet_box").hide();
    $("#winnings").text("$" + winnings);
  });

  $('#hit-button').click(function() {
    player_deal();
    var p_points = calculatePoints(playerHand);
    $("#player-points").text(p_points);

    if (p_points > 21) {
      console.log("Player busts");
      $("#player-points").text(p_points + ": Bust!");

        $("#hit-button").hide();
        $('#reset-button').show();
        $('#stand-button').hide();
        d_wins += 1;
    }
  });

  $('#stand-button').click(function(){
    p_points = $("#player-points").text();
    $("#dealer-points").text(d_points);
    $("#hidden_card").attr("src", hidden_image_url);
    $("#hit-button").hide();
    var d_points = calculatePoints(dealerHand);
    while (d_points <= 17){
      dealer_deal();
      d_points = calculatePoints(dealerHand);
      $("#dealer-points").text(d_points);
    }
    if (d_points > 21) {
      console.log("Dealer busts");
      $("#dealer-points").text(d_points + ": Bust!");
      $("#player-points").text(p_points + ": Player Wins!!");
      p_wins += 1;
      winnings += bet_amount * 2;
      $("#winnings").text("$" + winnings);

    }
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

  $('#reset-button').click(function() {
    deck = newDeck();
    $("#deal-button").show();
    // $("#hit-button").hide();
    // $("#stand-button").hide();
    $("#player-points").text('');
    $("#dealer-points").text('');
    $("#dealer-hand > img").remove();
    $("#player-hand > img").remove();
    d_points = 0;
    p_points = 0;
    dealerHand = [];
    playerHand = [];
    $("#player-wins").text(p_wins);
    $("#dealer-wins").text(d_wins);
    $("#score").show();
      $('#reset-button').hide();
    $("#bet_table").css("margin-top", "30px");
    $("#bet_box").val('').show();
    $("#current_bet_row").hide();
  });

});
// console.log(calculatePoints([{point: 1, suit: 'spades'},{point: 10, suit: 'spades'},{point: 2, suit: 'spades'}, {point: 1, suit: 'spades'}]));

function new_game() {
  player1 = document.getElementById('player1').value
  player2 = document.getElementById('player2').value
  players = JSON.stringify([player1, player2])

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      game_json = JSON.parse(this.responseText)
      window.location.href = 'game.html?id=' + game_json['id']
    }
  };

  xhttp.open("POST", "http://localhost:9292/game/?players=" + players, true);
  xhttp.send();
}

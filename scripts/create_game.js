function new_game() {
  player_name = document.getElementById('name').value

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //game_json = JSON.parse(this.responseText)
      //window.location.href = 'game.html?id=' + game_json['id']
      console.log(this.responseText)
    }
  };

  xhttp.open("POST", "http://localhost:9292/game/?player=" + player_name, true);
  xhttp.send();
}


function test() {
  xhttp = get_xhttp(console.log)
  xhttp.open("POST", "http://localhost:9292/game/?player=james", true);
  xhttp.send();
}
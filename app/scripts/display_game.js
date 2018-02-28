window.onload = function () {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      game_json = JSON.parse(this.responseText)
      populate_board(game_json)
      set_status_text(game_json)
    }
  };
  xhttp.open("GET", "http://localhost:9292/game/" + game_id(), true);
  xhttp.send();
}


function populate_board(game_json) {
  let dimension = game_json['game']['board']['dimension']
  let cells = game_json['game']['board']['cells']

  let table_body = document.getElementById("cell-container")
  for (let i = 0; i < dimension; i++) {
    let tr = document.createElement('TR')
    for (let j = 0; j < dimension; j++) {
      let cell_index = j + (i * 10)
      tr.appendChild(cell_markup(cells[cell_index]))
    }
    table_body.appendChild(tr)    
  }
}

function cell_markup(cell) {
  let number = cell['number']
  let symbols = player_symbols(cell['players'])
  let transition = transition_str(cell['transition'])

  let td = document.createElement('TD')
  let td_div = document.createElement('DIV')
  let num_div = document.createElement('DIV')
  let trans_div = document.createElement('DIV')
  let player_div = document.createElement('DIV')

  num_div.appendChild(document.createTextNode(number))
  trans_div.appendChild(document.createTextNode(transition))
  player_div.appendChild(document.createTextNode(symbols))

  num_div.classList.add("number");
  trans_div.classList.add("transition");
  player_div.classList.add("player")
  td_div.classList.add("cell");
  td.id = "cell" + number

  td_div.appendChild(num_div)
  td_div.appendChild(trans_div)
  td_div.appendChild(player_div)
  td.appendChild(td_div)  
  return td
}

function player_symbols(players) {
  let symbols_str = ""
  for (i = 0; i < players.length; i++) {
    symbols_str += players[i].charAt(0).toUpperCase()
  }
  return symbols_str
}

function transition_str(transition) {
  let start_pos = transition['starting_position']
  let dest_pos = transition['destination_position']

  if (start_pos < dest_pos) {
    return "L -> " + dest_pos
  } else if (dest_pos < start_pos) {
    return "S -> " + dest_pos
  } else {
    return ''
  }
}

function move_player() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      game_json = JSON.parse(this.responseText)
      update_player_positions(game_json)
      set_status_text(game_json)
    }
  };
  xhttp.open("POST", "http://localhost:9292/game/" + game_id() + "/move", true);
  xhttp.send();
}

function update_player_positions(game_json) {
  let dimension = game_json['game']['board']['dimension']
  let cells = game_json['game']['board']['cells']

  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < dimension; j++) {
      let cell_index = j + (i * 10)
      players_str = player_symbols(cells[cell_index]['players'])
      players_td = document.getElementById("cell" + cells[cell_index]['number'])
      players_div = players_td.getElementsByClassName("player")[0]
      players_div.innerHTML = players_str
    }
  }
}

function game_id() {
  let params = (new URL(document.location)).searchParams;
  return params.get("id");
}

function set_status_text(game_json) {
  let status = document.getElementById("status-text")
  let previous_player = game_json['game']['previous_player']
  let next_player = game_json['game']['next_player']
  let winning_position = game_json['game']['board']['winning_position']
  let previous_player_won = false

  for (i = 0; i < game_json['game']['players'].length; i++) {
    if (game_json['game']['players'][i]['name'] == previous_player) {
      let player = game_json['game']['players'][i]
      var last_roll = player['last_roll']

      if (player['position'] == winning_position) {
        previous_player_won = true
      }
    }
  }

  let text = ""

  if (last_roll > 0) {
    text += previous_player + " rolled a " + last_roll + "<br>"
  }
  
  if (previous_player_won) {
    text += previous_player + " won!"
    document.getElementById("move-player-btn").setAttribute("style", "display: none;")
  } else {
    text += "Next up: " + next_player
  }

  status.innerHTML = text
}

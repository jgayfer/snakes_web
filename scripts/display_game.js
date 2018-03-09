var game_id
var client_id
var player_name

function page_load() {
  load_data()
  game_id = store.get('game_id')
  client_id = store.get('client_id')
  player_name = store.get('player_name')

  get_game(game_id, setup_game)
  setInterval(update_game, 500)
}

function move_player_handler() {
  move(game_id, client_id, move_player_callback)
}

// ******************
// Internal functions
// ******************

function update_game() {
  get_game(game_id, update_game_callback)
}

function move_player_callback(json) {
  update_game()
}

function update_game_callback(json) {
  update_player_positions(json)
  set_move_button_visibility(json)
  set_status_text(json)
}

function setup_game(json) {
  populate_board(json)
  set_status_text(json)
  set_move_button_visibility(json)
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

function set_move_button_visibility(json) {
  var move_button = document.getElementById('move-player-btn')
  if (client_is_next_player(json)) {
    move_button.style.visibility = "visible"
  } else {
    move_button.style.visibility = "hidden"
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

function game_id() {
  let params = (new URL(document.location)).searchParams;
  return params.get("game_id");
}

function client_is_next_player(json) {
  if (json['game']['next_player'] == player_name) {
    return true
  }
}

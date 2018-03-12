var game_id
var client_id
var player_list

function page_load() {
  load_data()
  game_id = store.get("game_id")
  client_id = store.get("client_id")
  
  set_invite_link()

  player_list = document.getElementById('players')
  update_lobby()
  setInterval(update_lobby, 500)
}

function start_game_handler() {
  start_game(game_id, client_id)
  window.location.href = 'game.html?game_id=' + game_id
}

// ******************
// Internal functions
// ******************

function update_lobby() {
  get_game(game_id, update_lobby_callback)
}

function set_invite_link() {
  var invite_element = document.getElementById('invite-link')
  var invite_message = 'Invite link: ' + window.location.host + '/invite.html?game_id=' + game_id
  invite_element.innerHTML = invite_message
}

function update_lobby_callback(json) {
  if (json['game_has_started']) {
    window.location.href = 'game.html?game_id=' + game_id
  }
  update_lobby_players(json)
}

function update_lobby_players(json) {
  var players = json['game']['players']
  var new_player_list = document.createElement('UL')

  for (var i = 0; i < players.length; i++) {
    var player_name = players[i]['name']
    var player_element = document.createElement('LI')
    player_element.innerHTML = player_name
    new_player_list.appendChild(player_element)
  }

  if (new_player_list.innerHTML != player_list.innerHTML) {
    player_list.replaceWith(new_player_list)
    player_list = new_player_list
  }
}
var game_id

function page_load() {
  load_data()
  let params = (new URL(document.location)).searchParams
  game_id = params.get("game_id")
  store.set('game_id', game_id)
  get_game(game_id, retrieve_game_callback)
}

function accept_invite() {
  player_name = document.getElementById('name').value
  store.set('player_name', player_name)
  join_game(player_name, game_id, join_game_callback)
}

// ******************
// Internal functions
// ******************

function set_invite_header(json) {
  var invite_header = document.getElementById('invite-header')
  var player_name = json['game']['next_player']
  invite_header.innerHTML = player_name + ' has invited you to play!'
}

function retrieve_game_callback(json) {
  if (json['game_has_started']) {
    window.location.href = 'link_expired.html'
  } else {
    set_invite_header(json)
  }
}

function join_game_callback(json) {
  store.set('client_id', json['client_id'])
  window.location.href = 'lobby.html'
}
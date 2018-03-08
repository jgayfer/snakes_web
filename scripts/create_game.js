function new_game() {
  player_name = document.getElementById('name').value
  store.set('player_name', player_name)
  create_game(player_name, new_game_callback)
}

// ******************
// Internal functions
// ******************

function new_game_callback(json) {
  store.set('client_id', json['client_id'])
  store.set('game_id', json['game_id'])
  window.location.href = 'lobby.html'
}
function page_load() {
  load_data()
  setup_enter_listener()
}

function new_game() {
  player_name = document.getElementById('name').value
  store.set('player_name', player_name)
  create_game(player_name, new_game_callback)
}

// ******************
// Internal functions
// ******************

function setup_enter_listener() {
  var name_field = document.getElementById('name')
  name_field.addEventListener("keyup", function(event) {
    event.preventDefault()
    if (event.keyCode === 13) {
      new_game()
    }
  })
}

function new_game_callback(json) {
  store.set('client_id', json['client_id'])
  store.set('game_id', json['game_id'])
  window.location.href = 'lobby.html'
}
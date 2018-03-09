const BASE_URL = 'http://10.0.0.35:9292/'

function create_game(player_name, callback = empty_function) {
  post('game', {'player': player_name}, callback)
}

function join_game(player_name, game_id, callback = empty_function) {
  post('game/' + game_id + '/join', {'player': player_name}, callback)
}

function get_game(game_id, callback = empty_function) {
  get('game/' + game_id, {}, callback)
}

function move(game_id, client_id, callback = empty_function) {
  post('game/' + game_id + '/move', {'client_id': client_id}, callback)
}

function start_game(game_id, client_id, callback = empty_function) {
  post('game/' + game_id + '/start', {'client_id': client_id}, callback)
}

// ******************
// Internal functions
// ******************

empty_function = function() {}

function url_formatter(route, params) {
  var url = BASE_URL + route
  if (params) { url += '/?' }
  for (const [key, value] of Object.entries(params)) {
    url += key + '=' + value + '&'
  }
  if (Object.keys(params).length) {
    url = url.slice(0, -1)
  }
  return url
}

function get(route, params, callback) {
  var xhttp = get_xhttp(callback)
  xhttp.open("GET", url_formatter(route, params))
  xhttp.send()
}

function post(route, params, callback) {
  var xhttp = get_xhttp(callback)
  xhttp.open("POST", url_formatter(route, params))
  xhttp.send()
}

function get_xhttp(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.responseText))
    }
  }
  return xhttp
}
let assets = {}

function get(key) {
  return assets[key]
}

function isready() {
  let _assets = Object.values(assets)
  for(let i=0; i<_assets.length; ++i) {
    if(_assets[i] === false)
      return false
  }
  return true
}

function img(key, url, onready) {
  let _img = new Image()
  _img.src = url
  assets[key] = false
  _img.addEventListener("load", function() {
    assets[key] = _img
    //console.log(`Finishes loading: ${url}`)
    if(isready())
      onready()
  })
}

export default {
  assets,
  get,
  img
}

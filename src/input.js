export default {

  keydown(config) {
    window.addEventListener("keydown", function({key}) {
      if(config.hasOwnProperty(key)) config[key]()
    })
  },

  keyup(config) {
    window.addEventListener("keyup", function({key}) {
      if(config.hasOwnProperty(key)) config[key]()
    })
  },

  wheel(callback) {
    window.addEventListener("wheel", function({deltaY}) {
      callback(deltaY)
    })
  },

  mousemove(callback) {
    window.addEventListener("mousemove",
      function({buttons, movementX, movementY}) {
        if(buttons === 1)
          callback(movementX, movementY)
      }
    )
  }

}
/*
addEventListener("mousemove", ({buttons, movementX, movementY}) => {
    if(buttons !== 1) return
      const rs = 2
      const x = sign(movementX)
      const y = sign(movementY)
      squat = quat.mult(squat, quat.q(rs, ...vec3.scale(x, uvec)))
      squat = quat.mult(squat, quat.q(rs, ...vec3.scale(y, rvec)))
    })
    addEventListener("wheel", ({deltaY}) => {
      const z = sign(deltaY)
      squat = quat.mult(squat, quat.q(4, ...vec3.scale(z, fvec)))
    })
    */

import matrix from "@/matrix.js"

export default function(gl, ar, nc, fc, pos, vel, rota) {

  const pushPerspective = function(loc) {
    gl.uniformMatrix4fv(loc, false, matrix.perspective(ar,nc,fc))
  }

  const pushTranslation = function(loc) {
    const [x,y,z] = pos
    gl.uniformMatrix4fv(loc, false, matrix.translation([-x,-y,-z]))
  }

  const pushRotation = function(loc) {
    gl.uniformMatrix4fv(loc, true, matrix.rotation(rota))
  }

  const fpsControls = function() {
    const base_vel = 1
    window.addEventListener("keydown", function(e) {
      switch(e.key) {
        case "w":
          vel[2] = -base_vel
          break
        case "s":
          vel[2] = base_vel
          break
        case "a":
          vel[0] = -base_vel
          break
        case "d":
          vel[0] = base_vel
          break
        case " ":
          vel[1] = base_vel
          break
        case "c":
          vel[1] = -base_vel
          break
      }
    })
    window.addEventListener("keyup", function(e) {
      switch(e.key) {
        case "w":
          vel[2] = 0
          break
        case "s":
          vel[2] = 0
          break
        case "a":
          vel[0] = 0
          break
        case "d":
          vel[0] = 0
          break
        case " ":
          vel[1] = 0
          break
        case "c":
          vel[1] = 0
          break
      }
    })
  }

  const update = function() {
    pos[0] += vel[0]
    pos[1] += vel[1]
    pos[2] += vel[2]
  }

  return {
    pos,
    rota,
    pushTranslation,
    pushRotation,
    pushPerspective,
    update,
    fpsControls
  }
}

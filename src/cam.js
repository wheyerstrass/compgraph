import matrix from "@/matrix.js"
import vec3 from "@/vec.js"
import quat from "@/quat.js"

function lint(s, t, a, th) {
  const diff = (t-s)
  return (Math.abs(diff) > th) ? a*diff : 0
}

const {sign} = Math

export default function(
  gl, ar, nc, fc,
  pos, vel, // position
  rota, rota_t, // rotation
  uv_offset, squat,
  fvec, uvec, rvec
) {

  const pushPerspective = function(loc) {
    gl.uniformMatrix4fv(loc, false, matrix.perspectiveInf(ar,nc,fc))
  }

  const pushTranslation = function(loc) {
    const [x,y,z] = pos
    gl.uniformMatrix4fv(loc, false, matrix.translation([-x,-y,-z]))
  }

  const pushRotation = function(loc) {
    const mat = quat.mat(squat)
    gl.uniformMatrix4fv(loc, false, mat)
  }

  const fpsControls = function() {
    const base_vel = 2
    window.addEventListener("keydown", function(e) {
      switch(e.key) {
        case "w":
          vel[2] = base_vel
          break
        case "s":
          vel[2] = -base_vel
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
    let cull = true
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
        case "e":
          if(cull) {
            cull = false
            gl.disable(gl.CULL_FACE)
          } else {
            cull = true
            gl.enable(gl.CULL_FACE)
          }
          break
      }
    })
    addEventListener("mousemove", ({buttons, movementX, movementY}) => {
      if(buttons !== 1) return
      const x = sign(movementX)
      const y = sign(movementY)
      squat = quat.mult(squat, quat.q(1, ...vec3.scale(x, uvec)))
      squat = quat.mult(squat, quat.q(1, ...vec3.scale(y, rvec)))
      uv_offset[0] += 0.001*x
      uv_offset[1] += -0.001*y
    })
    addEventListener("wheel", ({deltaY}) => {
      const z = sign(deltaY)
      squat = quat.mult(squat, quat.q(4, ...vec3.scale(z, fvec)))
    })
  }

  const update = function() {
    // rotation
    squat = quat.norm(squat)
    const rota_mat = quat.mat(squat)
    uvec = matrix.mult3(rota_mat, [0,1,0])
    rvec = matrix.mult3(rota_mat, [1,0,0])
    fvec = matrix.mult3(rota_mat, [0,0,-1])
    //position
    pos[0] += lint(pos[0],
      pos[0] + rvec[0]*vel[0] + uvec[0]*vel[1] + fvec[0]*vel[2],
      0.1, 0.1
    )
    pos[1] += lint(pos[1],
      pos[1] + rvec[1]*vel[0] + uvec[1]*vel[1] + fvec[1]*vel[2],
      0.1, 0.1
    )
    pos[2] += lint(pos[2],
      pos[2] + rvec[2]*vel[0] + uvec[2]*vel[1] + fvec[2]*vel[2],
      0.1, 0.1
    )
  }

  return {
    pos,
    rota,
    squat,
    uv_offset,
    pushTranslation,
    pushRotation,
    pushPerspective,
    update,
    fpsControls
  }
}

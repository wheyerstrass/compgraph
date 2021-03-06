import math from "@/math.js"
import matrix from "@/matrix.js"
import vec3 from "@/vec.js"
import quat from "@/quat.js"

const {lint} = math
const {perspective, perspectiveInf} = matrix

export default function(gl, ar, nc, fc=false) {

  let cam = {}

  cam.pushPerspective = (fc) ?
    (loc, _fc=fc) => gl.uniformMatrix4fv(loc, false, perspective(ar,nc,_fc)) :
    (loc) => gl.uniformMatrix4fv(loc, false, perspectiveInf(ar,nc))

  cam.pushView = function() {
    /* needs to call 'fpsControls' or 'orbitControls' first */
  }

  cam.fpsControls = function(pos=[0,0,0], rota=[1,0,0,0]) {
    cam.pos = pos
    cam.rota = rota
    cam.pushView = function(trans_loc, rota_loc) {
      const [x,y,z] = cam.pos
      gl.uniformMatrix4fv(trans_loc, false, matrix.translate([-x,-y,-z]))
      const mat = quat.mat(cam.rota)
      gl.uniformMatrix4fv(rota_loc, false, mat)
    }
  }

  cam.orbitControls = function(target, dist=2, rota=[0,0]) {
    cam.dist = dist
    cam.dist_t = dist

    cam.pos = [0,0,0]
    cam.pos_t = [0,0,0]

    cam.rota = rota
    cam.rota_t = [...rota]

    cam.up = target.up

    cam.update = function(dt, th) {
      cam.dist += lint(cam.dist, cam.dist_t, 0.01*dt, th)
      cam.rota[0] += lint(cam.rota[0], cam.rota_t[0], dt, th)
      cam.rota[1] += lint(cam.rota[1], cam.rota_t[1], dt, th)
      
      const {right,up,forward} = target
      const rel_pos = vec3.scale(cam.dist, vec3.norm([0,1,-5]))
      const offset = [
        right[0]*rel_pos[0] + up[0]*rel_pos[1] + forward[0]*rel_pos[2],
        right[1]*rel_pos[0] + up[1]*rel_pos[1] + forward[1]*rel_pos[2],
        right[2]*rel_pos[0] + up[2]*rel_pos[1] + forward[2]*rel_pos[2],
      ]
      
      cam.pos_t[0] = target.pos[0] + offset[0]
      cam.pos_t[1] = target.pos[1] + offset[1]
      cam.pos_t[2] = target.pos[2] + offset[2]

      cam.pos[0] += math.lint(cam.pos[0], cam.pos_t[0], 2*dt, th)
      cam.pos[1] += math.lint(cam.pos[1], cam.pos_t[1], 2*dt, th)
      cam.pos[2] += math.lint(cam.pos[2], cam.pos_t[2], 3*dt, th)
    }
    cam.pushView = function(trans_loc, rota_loc) {
      gl.uniformMatrix4fv(rota_loc, false, cam.view())
      const [x,y,z] = cam.pos
      gl.uniformMatrix4fv(trans_loc, false, matrix.translate([-x,-y,-z]))
    }
    cam.view = function() {
      return quat.mat(target.rota)
    }
  }

  return cam
}

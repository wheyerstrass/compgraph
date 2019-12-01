import math from "@/math.js"
import matrix from "@/matrix.js"
//import vec3 from "@/vec.js"
import quat from "@/quat.js"

const {lint,rad} = math
const {sin,cos} = Math
const {perspective, perspectiveInf} = matrix

export default function(gl, ar, nc, fc=false) {

  let cam = {}

  cam.pushPerspective = (fc) ?
    (loc) => gl.uniformMatrix4fv(loc, false, perspective(ar,nc,fc)) :
    (loc) => gl.uniformMatrix4fv(loc, false, perspectiveInf(ar,nc))

  cam.pushView = function() {
    /* needs to call 'fpsControls' or 'orbitControls' first */
  }

  cam.fpsControls = function(pos=[0,0,0], rota=[1,0,0,0]) {
    cam.pos = pos
    cam.rota = rota
    cam.pushView = function(trans_loc, rota_loc) {
      const [x,y,z] = cam.pos
      gl.uniformMatrix4fv(trans_loc, false, matrix.translation([-x,-y,-z]))
      const mat = quat.mat(cam.rota)
      gl.uniformMatrix4fv(rota_loc, false, mat)
    }
  }

  cam.orbitControls = function(targetPos, dist=10, pos=[0,0,0], rota=[0,90]) {
    cam.dist = dist
    cam.dist_t = dist
    pos[0] += targetPos[0]
    pos[1] += targetPos[1]
    pos[2] += targetPos[2]
    cam.pos = pos
    cam.pos_t = [...pos]
    cam.rota = rota
    cam.rota_t = [...rota]
    cam.up = [0,1,0]
    cam.update = function() {
      cam.dist += lint(cam.dist, cam.dist_t, 0.1, 0.1)
      cam.rota[0] += lint(cam.rota[0], cam.rota_t[0], 0.1, 0.1)
      cam.rota[1] += lint(cam.rota[1], cam.rota_t[1], 0.1, 0.1)
      const phi = rad(cam.rota[0])
      const theta = rad(cam.rota[1])
      const z = cam.dist*sin(theta)*cos(phi)
      const x = cam.dist*sin(theta)*sin(phi)
      const y = cam.dist*cos(theta)
      cam.pos[0] = targetPos[0] + x
      cam.pos[1] = targetPos[1] + y
      cam.pos[2] = targetPos[2] + z
    }
    cam.pushView = function(trans_loc, rota_loc) {
      const [x,y,z] = cam.pos
      gl.uniformMatrix4fv(trans_loc, false, matrix.translation([-x,-y,-z]))
      const mat = matrix.lookat(cam.pos, targetPos, cam.up)
      //cam.up[0] = mat[1]
      //cam.up[1] = mat[5]
      //cam.up[2] = mat[9]
      gl.uniformMatrix4fv(rota_loc, false, mat)
    }
  }

  return cam
}

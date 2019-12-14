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

  cam.orbitControls = function(target, dist=10, offset=[0,1,5], rota=[0,0]) {
    cam.dist = dist
    cam.dist_t = dist

    cam.pos = [0,0,0]
    cam.pos_t = [0,0,0]

    cam.rota = rota
    cam.rota_t = [...rota]

    cam.up = target.up

    cam.update = function(dt, th) {
      cam.dist += lint(cam.dist, cam.dist_t, dt, th)
      cam.rota[0] += lint(cam.rota[0], cam.rota_t[0], dt, th)
      cam.rota[1] += lint(cam.rota[1], cam.rota_t[1], dt, th)
      
      cam.pos_t[0] = target.pos[0] + offset[0]
      cam.pos_t[1] = target.pos[1] + offset[1]
      cam.pos_t[2] = target.pos[2] + offset[2]

      cam.pos[0] += math.lint(cam.pos[0], cam.pos_t[0], dt, th)
      cam.pos[1] += math.lint(cam.pos[1], cam.pos_t[1], dt, th)
      cam.pos[2] += math.lint(cam.pos[2], cam.pos_t[2], dt, th)
    }
    cam.pushView = function(trans_loc, rota_loc) {
      const [x,y,z] = cam.pos
      gl.uniformMatrix4fv(rota_loc, false, cam.view())
      gl.uniformMatrix4fv(trans_loc, false, matrix.translate([-x,-y,-z]))
    }
    cam.view = function() {
      const [x,y,z] = cam.pos
      const rot_around_up = quat.axis_angle(target.up, cam.rota[0])
      const rot_around_right = quat.axis_angle(target.right, cam.rota[1])
      return matrix.prod(
        quat.mat(quat.mult(rot_around_right, rot_around_up)),
        matrix.translate([-x,-y,-z])
      )
      //return quat.mat(quat.mult(rot_around_right, rot_around_up));
    }
  }

  cam._orbitControls = function(target, dist=10, pos=[0,0,0], rota=[0,90]) {
    cam.dist = dist
    cam.dist_t = dist
    pos[0] += target.pos[0]
    pos[1] += target.pos[1]
    pos[2] += target.pos[2]
    cam.pos = pos
    cam.pos_t = [...pos]
    cam.rota = rota
    cam.rota_t = [...rota]
    cam.up = [...target.up]
    cam.update = function(dt, th) {
      cam.dist += lint(cam.dist, cam.dist_t, dt, th)
      cam.rota[0] += lint(cam.rota[0], cam.rota_t[0], dt, th)
      cam.rota[1] += lint(cam.rota[1], cam.rota_t[1], dt, th)
      
      const phi = rad(cam.rota[0])
      const theta = rad(cam.rota[1])
      const z = cam.dist*sin(theta)*cos(phi)
      const x = cam.dist*sin(theta)*sin(phi)
      const y = cam.dist*cos(theta)

      cam.pos_t[0] = target.pos[0] + x
      cam.pos_t[1] = target.pos[1] + y
      cam.pos_t[2] = target.pos[2] + z

      dt *= 0.5
      cam.pos[0] += math.lint(cam.pos[0], cam.pos_t[0], dt, th)
      cam.pos[1] += math.lint(cam.pos[1], cam.pos_t[1], dt, th)
      cam.pos[2] += math.lint(cam.pos[2], cam.pos_t[2], dt, th)
    }
    cam.pushView = function(trans_loc, rota_loc) {
      const mat = matrix.lookat(cam.pos, target.pos, target.up)
      const [x,y,z] = cam.pos
      gl.uniformMatrix4fv(trans_loc, false, matrix.translate([-x,-y,-z]))
      gl.uniformMatrix4fv(rota_loc, false, mat)
    }
    cam.view = function() {
      return matrix.lookat(cam.pos, target.pos, target.up)
    }
  }

  return cam
}

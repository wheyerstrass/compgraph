import quat from "@/quat.js"
import matrix from "@/matrix.js"
import math from "@/math.js"

const base_up = [0,1,0]
const base_right = [1,0,0]
const base_forward = [0,0,-1]

const {sign,abs} = Math

export default {
  addRigidBody(target) {
    target.pos = [0,0,0]
    target.pos_t = [0,0,0]
    target.vel = [0,0,0]

    target.rota = [1,0,0,0] // current rotation
    target.rota_t = [1,0,0,0] // target rotation
    target.torq = [0,0,0]

    target.up = [...base_up]
    target.right = [...base_up]
    target.forward = [...base_forward]

    target.addRota = function(angle, [ax,ay,az]) {
      if(angle===0) return
      const s = sign(angle)
      const val = abs(angle)
      target.rota_t = quat.mult(target.rota_t, quat.q(val,s*ax,s*ay,s*az))
    }

    target.update = function() {
      target.addRota(target.torq[0], target.right)
      target.addRota(target.torq[1], target.up)
      target.addRota(target.torq[2], target.forward)

      const _q = quat.slerp(target.rota, target.rota_t, 0.1)
      target.rota[0] = _q[0]
      target.rota[1] = _q[1]
      target.rota[2] = _q[2]
      target.rota[3] = _q[3]

      const rota_mat = quat.mat(target.rota)
      target.up = matrix.mult3(rota_mat, base_up)
      target.right = matrix.mult3(rota_mat, base_right)
      target.forward = matrix.mult3(rota_mat, base_forward)

      const {up,right,forward,vel} = target

      target.pos_t[0] += right[0]*vel[0] + up[0]*vel[1] + forward[0]*vel[2]
      target.pos[0] += math.lint(target.pos[0], target.pos_t[0], 0.02, 0.1)

      target.pos_t[1] += right[1]*vel[0] + up[1]*vel[1] + forward[1]*vel[2]
      target.pos[1] += math.lint(target.pos[1], target.pos_t[1], 0.02, 0.1)

      target.pos_t[2] += right[2]*vel[0] + up[2]*vel[1] + forward[2]*vel[2]
      target.pos[2] += math.lint(target.pos[2], target.pos_t[2], 0.02, 0.1)
    }
  },
}

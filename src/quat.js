export default {
  q(w,x,y,z) {
    const {PI, cos, sin} = Math
    const t = w * PI/180/2
    const sint = sin(t)
    return [cos(t), sint*x, sint*y, sint*z]
  },

  mult([q0,q1,q2,q3], [r0,r1,r2,r3]) {
    return [
      r0*q0 - r1*q1 - r2*q2 - r3*q3,
      r0*q1 + r1*q0 - r2*q3 + r3*q2,
      r0*q2 + r1*q3 + r2*q0 - r3*q1,
      r0*q3 - r1*q2 + r2*q1 + r3*q0,
    ]
  },

  norm([q0,q1,q2,q3]) {
    const l = Math.abs(q0*q0 + q1*q1 + q2*q2 + q3*q3)
    return [q0/l, q1/l, q2/l, q3/l]
  },

  mat(_q) {
    const [q0,q1,q2,q3] = this.norm(_q)

    const xx = q1*q1
    const yy = q2*q2
    const zz = q3*q3

    const xy = q1*q2
    const xz = q1*q3
    const wx = q0*q1
    const wy = q0*q2
    const wz = q0*q3
    const yz = q2*q3

    return [
      1-2*(yy+zz), 2*(xy+wz), 2*(xz-wy), 0,
      2*(xy-wz), 1-2*(xx+zz), 2*(yz+wx), 0,
      2*(xz+wy), 2*(yz-wx), 1-2*(xx+yy), 0,
      0, 0, 0, 1
    ]
  },

  inv([ ,q1,q2,q3]) {
    return [-q1, -q2, -q3]
  },

}

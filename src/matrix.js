import vec3 from "@/vec.js"

function rad(deg) {
  return deg*Math.PI/180
}

export default {

  translation: function(vec) {
    const [x,y,z] = vec
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ])
  },

  rotation: function(axis_angle) {
    let [x_,y_,z_,a] = axis_angle
    a = -rad(a)
    const [x,y,z] = vec3.norm([x_,y_,z_])
    const sina = Math.sin(a)
    const cosa = Math.cos(a)
    return [
      x*x+(1-x*x)*cosa, x*y*(1-cosa)-z*sina, x*z*(1-cosa)+y*sina, 0,
      x*y*(1-cosa)+z*sina, y*y+(1-y*y)*cosa, y*z*(1-cosa)-x*sina, 0,
      x*z*(1-cosa)-y*sina, y*z*(1-cosa)+x*sina, z*z+(1-z*z)*cosa, 0,
      0, 0, 0, 1
    ]
  },

  perspective: function(ar, nc, fc) {
    ar = 1./ar
    const fov = 75.0/ar
    const range = Math.tan(0.5*fov)*nc

    return [
      nc/range*ar, 0, 0, 0,
      0, nc/range, 0, 0,
      0, 0, (fc+nc)/(nc-fc), -1,
      0, 0, 2*nc*fc/(nc-fc), 0
    ]
  },
  perspectiveInf: function(ar, nc) {
    ar = 1./ar
    const fov = 67/ar
    const range = Math.tan(0.5*fov)*nc

    return [
      nc/range*ar, 0, 0, 0,
      0, nc/range, 0, 0,
      0, 0, -1, -1,
      0, 0, -2*nc, 0
    ]
  },

  ortho: function(l, r, t, b, nc, fc) {
    return [
      2/(r-l), 0, 0, -(r+l)/(r-l),
      0, 2/(t-b), 0, -(t+b)/(t-b),
      0, 0, -2/(fc-nc), -(fc+nc)/(fc-nc),
      0, 0, 0, 1
    ]
  },

  // always 4x4 matrix and 1x4 vector
  mult: function([
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33
  ], [x,y,z,w]) {
    return [
      m00*x + m01*y + m02*z + m03*w,
      m10*x + m11*y + m12*z + m13*w,
      m20*x + m21*y + m22*z + m23*w,
      m30*x + m31*y + m32*z + m33*w,
    ]
  },

  mult3: function([
    m00, m01, m02, ,
    m10, m11, m12, ,
    m20, m21, m22, ,
       ,    ,    , ,
  ], [x,y,z, ]) {
    return [
      m00*x + m01*y + m02*z,
      m10*x + m11*y + m12*z,
      m20*x + m21*y + m22*z,
    ]
  }
}

function norm(vec) {
  const length = Math.sqrt(vec.reduce((all, c) => all+c*c, 0))
  return vec.map(c => c/length)
}

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
    a = rad(a)
    const [x,y,z] = norm([x_,y_,z_])
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
    const fov = 67.0/ar
    const range = Math.tan(0.5*fov)*nc

    return [
      nc/range*ar, 0, 0, 0,
      0, nc/range, 0, 0,
      0, 0, (fc+nc)/(nc-fc), -1,
      0, 0, 2*nc*fc/(nc-fc), 0
    ]
  },

  mult: function(a, b) {
    return a+b
  }

}

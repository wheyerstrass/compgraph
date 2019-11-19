export default {

  prog: function(gl, vertSrc, fragSrc, uniforms) {

    const _shader = function(type, src) {
      let s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (gl.getShaderParameter(s, gl.COMPILE_STATUS))
        return s
      console.error(gl.getShaderInfoLog(s))
      gl.deleteShader(s)
    }

    let p = gl.createProgram()
    gl.attachShader(p, _shader(gl.VERTEX_SHADER, vertSrc))
    gl.attachShader(p, _shader(gl.FRAGMENT_SHADER, fragSrc))
    gl.linkProgram(p)

    if (gl.getProgramParameter(p, gl.LINK_STATUS)) {
      let locs = {}
      uniforms.forEach(u => locs[u] = gl.getUniformLocation(p, u))
      return { id: p, locs }
    }
    console.error(gl.getProgramInfoLog(p))
    gl.deleteProgram(p)
  }
}


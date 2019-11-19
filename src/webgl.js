export default {

  shader: function shader(gl, type, src) {
    let s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (gl.getShaderParameter(s, gl.COMPILE_STATUS))
      return s
    console.error(gl.getShaderInfoLog(s))
    gl.deleteShader(s)
  },

  shaderProg: function(gl, vertShader, fragShader, uniforms) {
    let prog = gl.createProgram()
    gl.attachShader(prog, vertShader)
    gl.attachShader(prog, fragShader)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog))
      gl.deleteProgram(prog)
      return null
    }
    let locs = {}
    uniforms.forEach(u => locs[u] = gl.getUniformLocation(prog, u))
    return { id: prog, locs }
  }
}


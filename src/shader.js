const dummytex = new Uint8Array([255,0,255,255])

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
      return { id: p, locs, objs: [] }
    }
    console.error(gl.getProgramInfoLog(p))
    gl.deleteProgram(p)
  },

  texture: function(gl, url, texunit, samp_loc, mipmap=true) {
    gl.uniform1i(samp_loc, texunit)
    
    let id = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0+texunit)
    gl.bindTexture(gl.TEXTURE_2D, id)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, dummytex)

    let img = new Image()
    img.src = url
    img.addEventListener("load", function() {
      gl.bindTexture(gl.TEXTURE_2D, id)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      if(mipmap)
        gl.generateMipmap(gl.TEXTURE_2D)
    })
    return {id,img}
  }

}


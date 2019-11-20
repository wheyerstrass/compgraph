import matrix from "@/matrix.js"

export default {

  cubeOut: function(gl, prog, size, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const l = size/2;
    let vb = [
      // front
      l,   l, l,
      -l, -l, l,
      l,  -l, l,
      l,   l, l,
      -l,  l, l,
      -l, -l, l,
      // back
      l,   l, -l,
      l,  -l, -l,
      -l, -l, -l,
      l,   l, -l,
      -l, -l, -l,
      -l,  l, -l,
      // left
      -l,  l, l,
      -l, -l, -l,
      -l, -l, l,
      -l,  l,  l,
      -l,  l, -l,
      -l, -l, -l,
      // right
      l,  l, l,
      l, -l, l,
      l, -l, -l,
      l,  l,  l,
      l, -l, -l,
      l,  l, -l,
      // top
      l,  l, l,
      l,  l, -l,
      -l, l, -l,
      l,  l, l,
      -l, l, -l,
      -l, l, l,
      // bot
      l, -l,  l,
      -l, -l, -l,
      l, -l, -l,
      l, -l,  l,
      -l, -l,  l,
      -l, -l, -l,
      // normals
      // front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      // back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      // left
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      // right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      // bot
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass normal to shader */
    const nor_loc = gl.getAttribLocation(prog, "nor")
    gl.enableVertexAttribArray(nor_loc)
    gl.vertexAttribPointer(nor_loc, 3, gl.FLOAT, false, 0, 3*4*6*6)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)

    //let pos = [0, -0.5, -3]
    //let rota = [0, 1, 0, 0]

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*6)
      }
    }
  },

  plane: function(gl, prog, size, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const l = size/2;
    let vbuffer = [
      l,  0, l,
      l,  0, -l,
      -l, 0, -l,
      l,  0, l,
      -l, 0, -l,
      -l, 0, l,
      // normals
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbuffer), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /*
     * pass normal to shader */
    const nor_loc = gl.getAttribLocation(prog, "nor")
    gl.enableVertexAttribArray(nor_loc)
    gl.vertexAttribPointer(nor_loc, 3, gl.FLOAT, false, 0, 3*4*6)

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*1)
      }
    }
  },

  quad: function(gl, prog, size, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const l = size/2;
    let vbuffer = [
       l,  l, 0,
      -l, -l, 0,
       l, -l, 0,
       l,  l, 0,
      -l,  l, 0,
      -l, -l, 0,
      // uv
       1,  1,
       0,  0,
       1,  0,
       1,  1,
       0,  1, 
       0,  0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbuffer), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /* 
     * pass uv to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6)

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*1)
      }
    }
  },
}

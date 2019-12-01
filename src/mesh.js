import vec3 from "@/vec.js"
import matrix from "@/matrix.js"
import quat from "@/quat.js"

export default {

  ship: function(gl, prog) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let vb = [
      // bot
      0, 0, -5,
      2, 0, 2,
      -2, 0, 2,
      // back
      -2, 0, 2,
      2, 0, 2,
      2, 1, 2,
      -2, 0, 2,
      2, 1, 2,
      -2, 1, 2,
      // left
      2, 1, 2,
      2, 0, 2,
      0, 1, -5,
      2, 0, 2,
      0, 0, -5,
      0, 1, -5,
      // right
      -2, 1, 2,
      0, 1, -5,
      -2, 0, 2,
      -2, 0, 2,
      0, 1, -5,
      0, 0, -5,
      // top
      0, 1, -5,
      -2, 1, 2,
      2, 1, 2,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)

    return {
      preDraw: function({trans_loc, rota_loc, pos, rota}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, quat.mat(quat.inv(rota)))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, vb.length/3)
      }
    }
  },
  cube: function(gl, prog, size) {
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

    return {
      preDraw: function({trans_loc, rota_loc, pos, rota}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, quat.mat(quat.inv(rota)))
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
    const t = size/10;
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
      // texcoords
      t, t,
      t, 0,
      0, 0,
      t, t,
      0, 0,
      0, t,
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
    /*
     * pass texcoords to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6*2)

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
      },
      update: function() {}
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
      preDraw: function({trans_loc, rota_loc, proj_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
        //gl.uniformMatrix4fv(proj_loc, true,
        //matrix.ortho(-1000, 1000, 1000, -1000, 0.1, 3000)
        //)
      },
      draw: function({proj_loc, cam}) {
        gl.useProgram(prog)
        gl.clear(gl.DEPTH_BUFFER_BIT)
        gl.disable(gl.DEPTH_TEST)
        gl.drawArrays(gl.TRIANGLES, 0, 6*1)
        gl.enable(gl.DEPTH_TEST)
        //cam.pushPerspective(proj_loc)
      }
    }
  },
  bgquad: function(gl, prog, uv) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let [u0, v0, usize, vsize] = uv
    let vbuffer = [
      -1, 1,
      -1, -1,
      1, -1,
      -1, 1,
      1, -1,
      1, 1,
      // uv
      u0, v0+vsize,
      u0, v0,
      u0+usize, v0,
      u0, v0+vsize,
      u0+usize, v0,
      u0+usize, v0+vsize,
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
    gl.vertexAttribPointer(pos_loc, 2, gl.FLOAT, false, 0, 0)
    /* 
     * pass uv to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 2*4*6)

    return {
      uv,
      preDraw: function({uv_offset_loc, cam}) {
        gl.bindVertexArray(vao)
        //gl.uniform2fv(uv_offset_loc, cam.uv_offset)
      },
      draw: function() {
        gl.useProgram(prog)
        gl.clear(gl.DEPTH_BUFFER_BIT)
        gl.disable(gl.DEPTH_TEST)
        gl.drawArrays(gl.TRIANGLES, 0, 6*1)
        gl.enable(gl.DEPTH_TEST)
      },
      update: function(){}
    }
  },

  grid: function(gl, prog, size, res, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let vb = []
    let s = size/res
    // positions
    for(let z=0; z<res; ++z) {
      for(let x=0; x<res; ++x) {
        // bottom left triangle
        vb.push(-size/2+x*s, 0, -size/2+z*s) // ul
        vb.push(-size/2+x*s, 0, -size/2+(z+1)*s) // bl
        vb.push(-size/2+(x+1)*s, 0, -size/2+(z+1)*s) // br
        // top right triangle
        vb.push(-size/2+x*s, 0, -size/2+z*s) // ul
        vb.push(-size/2+(x+1)*s, 0, -size/2+(z+1)*s) // br
        vb.push(-size/2+(x+1)*s, 0, -size/2+z*s) // tr
      }
    }
    // texcoords
    s = 1/res
    for(let v=0; v<res; ++v) {
      for(let u=0; u<res; ++u) {
        // bottom left triangle
        vb.push(0+u*s, 0+v*s) // ul
        vb.push(0+u*s, 0+(v+1)*s) // bl
        vb.push(0+(u+1)*s, 0+(v+1)*s) // br
        // top right triangle
        vb.push(0+u*s, 0+v*s) // ul
        vb.push(0+(u+1)*s, 0+(v+1)*s) // br
        vb.push(0+(u+1)*s, 0+v*s) // tr
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

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
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6*res*res)

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
        gl.drawArrays(gl.TRIANGLES, 0, 6*res*res)
      }
    }
  },

  sphereIn: function(gl, prog, size, res, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    /*
     *     /\    
     *    /__\  
     *   /\  /\
     *  /__\/__\
     *         ^
     *  start bottom right and go counter-clockwise
     */
    const s2 = 1/Math.sqrt(2)
    const lvl0 = [
      // bot right
      0, 1, s2,
      1, 0, -s2,
      0, -1, s2,
      // top
      1, 0, -s2,
      0, 1, s2,
      -1, 0, -s2,
      // bot left
      0, -1, s2,
      -1, 0, -s2,
      0, 1, s2,
      // mid
      1, 0, -s2,
      -1, 0, -s2,
      0, -1, s2
    ]
    /* 1 triangle in -> 4 triangles out */
    const {sum, scale, norm} = vec3
    const tess = function([
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9
    ]) {
      const m1p = scale(0.5, sum([p1,p2,p3], [p4,p5,p6]))
      const m2p = scale(0.5, sum([p4,p5,p6], [p7,p8,p9]))
      const m3p = scale(0.5, sum([p7,p8,p9], [p1,p2,p3]))
      return [
        //p7,p8,p9, ...m2p, ...m3p,
        //...m2p, p4,p5,p6, ...m1p,
        //...m3p, ...m1p, p1,p2,p3,
        //...m3p, ...m2p, ...m1p
        p1,p2,p3, ...m1p, ...m3p,
        ...m1p, p4,p5,p6, ...m2p,
        ...m3p, ...m2p, p7,p8,p9,
        ...m1p, ...m2p, ...m3p
      ]
    }
    let lvli = [...lvl0]
    let lvln = []
    for(let lvl=0; lvl<res; ++lvl) {
      for(let l=0; l<lvli.length; l+=9) {
        lvln.push(...tess([
          lvli[l+0], lvli[l+1], lvli[l+2],
          lvli[l+3], lvli[l+4], lvli[l+5],
          lvli[l+6], lvli[l+7], lvli[l+8]
        ]))
      }
      lvli = [...lvln]
      lvln = []
    }
    let vb = []
    for(let l=0; l<lvli.length; l+=3) {
      vb.push(...scale(size, norm([lvli[l+0], lvli[l+1], lvli[l+2]])))
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

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
     * pass uv to shader - pos == uv in sphere case */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 3, gl.FLOAT, false, 0, 0)

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
        gl.drawArrays(gl.TRIANGLES, 0, 3*4*Math.pow(4,res))
      }
    }
  },

  sphereOut: function(gl, prog, size, res, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    /*
     *     /\    
     *    /__\  
     *   /\  /\
     *  /__\/__\
     *  ^
     *  start bottom left and go clockwise
     */
    const s2 = 1/Math.sqrt(2)
    const lvl0 = [
      // bot left
      0, 1, s2,
      -1, 0, -s2,
      0, -1, s2,
      // top
      -1, 0, -s2,
      0, 1, s2,
      1, 0, -s2,
      // bot right
      0, -1, s2,
      1, 0, -s2,
      0, 1, s2,
      // mid
      -1, 0, -s2,
      1, 0, -s2,
      0, -1, s2
    ]
    /* 1 triangle in -> 4 triangles out */
    const {sum, scale, norm} = vec3
    const tess = function([
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9
    ]) {
      const m1p = scale(0.5, sum([p1,p2,p3], [p4,p5,p6]))
      const m2p = scale(0.5, sum([p4,p5,p6], [p7,p8,p9]))
      const m3p = scale(0.5, sum([p7,p8,p9], [p1,p2,p3]))
      return [
        p1,p2,p3, ...m1p, ...m3p,
        ...m1p, p4,p5,p6, ...m2p,
        ...m3p, ...m2p, p7,p8,p9,
        ...m1p, ...m2p, ...m3p
      ]
    }
    let lvli = [...lvl0]
    let lvln = []
    for(let lvl=0; lvl<res; ++lvl) {
      for(let l=0; l<lvli.length; l+=9) {
        lvln.push(...tess([
          lvli[l+0], lvli[l+1], lvli[l+2],
          lvli[l+3], lvli[l+4], lvli[l+5],
          lvli[l+6], lvli[l+7], lvli[l+8]
        ]))
      }
      lvli = [...lvln]
      lvln = []
    }
    let vb = []
    for(let l=0; l<lvli.length; l+=3) {
      vb.push(...scale(size, norm([lvli[l+0], lvli[l+1], lvli[l+2]])))
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

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
    gl.vertexAttribPointer(uv_loc, 3, gl.FLOAT, false, 0, 0)

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
        gl.drawArrays(gl.TRIANGLES, 0, 3*4*Math.pow(4,res))
      },
      update: function() {}
    }
  },

  tube: function(gl, prog, length, r0, r1, res, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let verts = []
    const xy = (a,r) => [r*Math.cos(a), r*Math.sin(a)]
    const angle = (i) => (2*Math.PI/res * i)
    const z0 = length/2
    const z1 = -length/2
    for(let i=0; i<res; ++i) {
      // inner coords
      const [x0,y0] = xy(angle(i),r0)
      const [x1,y1] = xy(angle(i+1),r0)
      // outer coords
      const [X0,Y0] = xy(angle(i),r1)
      const [X1,Y1] = xy(angle(i+1),r1)
      // front face
      verts.push(x0, y0, z0)
      verts.push(x1, y1, z0)
      verts.push(X1, Y1, z0)
      //
      verts.push(x0, y0, z0)
      verts.push(X1, Y1, z0)
      verts.push(X0, Y0, z0)
      // inner face
      verts.push(x0, y0, z0)
      verts.push(x0, y0, z1)
      verts.push(x1, y1, z0)
      //
      verts.push(x0, y0, z1)
      verts.push(x1, y1, z1)
      verts.push(x1, y1, z0)
      // outer face
      verts.push(X0, Y0, z0)
      verts.push(X1, Y1, z1)
      verts.push(X0, Y0, z1)
      //
      verts.push(X0, Y0, z0)
      verts.push(X1, Y1, z0)
      verts.push(X1, Y1, z1)
      // back face
      verts.push(x0, y0, z1)
      verts.push(X1, Y1, z1)
      verts.push(x1, y1, z1)
      //
      verts.push(x0, y0, z1)
      verts.push(X0, Y0, z1)
      verts.push(X1, Y1, z1)
    }
    // uv
    for(let i=0; i<res; ++i) {
      // front face
      verts.push(1,1)
      verts.push(0,1)
      verts.push(0,0)
      //
      verts.push(1,1)
      verts.push(0,1)
      verts.push(1,0)
      // inner face
      verts.push(1,1)
      verts.push(0,1)
      verts.push(1,0)
      //
      verts.push(0,1)
      verts.push(0,0)
      verts.push(1,0)
      // outer face
      verts.push(0,1)
      verts.push(1,0)
      verts.push(1,1)
      //
      verts.push(0,1)
      verts.push(0,0)
      verts.push(1,0)
      // back face
      verts.push(0,1)
      verts.push(1,0)
      verts.push(1,1)
      //
      verts.push(0,1)
      verts.push(0,0)
      verts.push(1,0)
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
    //console.log(verts.length/3, 6*res*2)

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
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*8*res)

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
        gl.drawArrays(gl.TRIANGLES, 0, 3*8*res)
      }
    }
  },


}

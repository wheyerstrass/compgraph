<template>
  <div id="app" class="p-1">
    <canvas :id="canvasId"
      :width="w"
      :height="h">
    </canvas>
    <div id="debug">
      {{ship.distToNull}}
    </div>
  </div>
</template>

<script>
import camera from "@/cam.js"
import meshes from "@/mesh.js"
import shader from "@/shader.js"
import assets from "@/assets.js"
import comps from "@/comps.js"
import input from "@/input.js"

/* mesh shaders */
import sunp from "@/sun.glsl.js"
import intp from "@/dyson-interior.glsl.js"
import intwp from "@/dyson-water.glsl.js"
import hullp from "@/dyson-hull.glsl.js"
import tubep from "@/dyson-port.glsl.js"
import shipp from "@/ship.glsl.js"
import starsp from "@/stars.glsl.js"

/* glsl functions */
import fogp from "@/fog.glsl.js"
import phongp from "@/phong.glsl.js"
import triplanarp from "@/triplanar.glsl.js"

import matrix from "@/matrix.js"
import quat from "@/quat.js"
import vec from "@/vec.js"
import math from "@/math.js"

export default {
  name: 'home',
  data() {
    return {
      w: 1024,
      h: 576,
      ship: {pos: [-1,-1,-1], pos_t: [-1,-1,-1], distToNull: -1, a:0,b:0}
    }
  },
  computed: {
    canvasId() { return `canvas-${Date.now()}` },
    pos() {
      const [x,y,z] = this.ship.pos
      return `${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`
    },
    distToNull() {
      return `${this.ship.distToNull.toFixed(2)}`
    }
  },
  methods: {
  },
  beforeDestroy() {
    //window.removeEventListener("keydown")
  },
  mounted() {
    const vue = this
    const canvas = document.getElementById(this.canvasId)
    const gl = canvas.getContext("webgl2", {premultipliedAlpha: false})
    if(!gl) {
      console.error("Keine WebGL 2 Unterstützung")
      return
    }
    /*
     * gl settings */
    gl.enable(gl.DITHER)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0.0, 0.0, 0.0, 1)
    const res = [gl.drawingBufferWidth, gl.drawingBufferHeight]
    /*
     * ship */
    let ship_prog = shader.prog(gl, shipp.vert(), shipp.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_norm"
    ])
    let ship = meshes.ship(gl, ship_prog.id)
    ship_prog.objs.push(ship)
    comps.rigidbody(ship)
    /*
     * cam */
    let cam = camera(gl, canvas.clientWidth/canvas.clientHeight,1)
    cam.orbitControls(ship, 2)
    
    let acc = 10
    input.keydown({
      "w": () => (ship.vel[2] = 1*acc),
      "s": () => (ship.vel[2] = -1*acc),
      "a": () => (ship.torq[2] = 1),
      "d": () => (ship.torq[2] = -1),
      "q": () => (ship.torq[1] = -1),
      "e": () => (ship.torq[1] = 1),
      " ": () => (ship.torq[0] = -1),
      "c": () => (ship.torq[0] = 1),
    })
    input.keyup({
      "w": () => (ship.vel[2] = 0),
      "s": () => (ship.vel[2] = 0),
      "a": () => (ship.torq[2] = 0),
      "d": () => (ship.torq[2] = 0),
      "q": () => (ship.torq[1] = 0),
      "e": () => (ship.torq[1] = 0),
      " ": () => (ship.torq[0] = 0),
      "c": () => (ship.torq[0] = 0),
    })
    input.mousemove(function(mx,my) {
      cam.rota_t[0] += -mx*0.5
      cam.rota_t[1] += -my*0.5
    })
    input.wheel(function(deltaY) {
      cam.dist_t += 2*deltaY
      cam.dist_t = Math.max(cam.dist_t, 2)
    })
    /*
     * shader programs 
     */
    const _up = (...fs) => fs.reduce((all,f) => all.concat(f, " "), "")
    const _phong = phongp(0.2,0.5,0.1)
    const _fog = fogp(0.5,0.6,0.9)
    const _triplanar = triplanarp()
    const funcs = _up(_phong,_fog,_triplanar)

    /*
     * sun */
    let sun_prog = shader.prog(gl, sunp.vert(), sunp.frag(), [
      "time", "res",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_col2"
    ])
    let sun = meshes.quad(gl, sun_prog.id)
    comps.billboard(sun, cam)
    sun_prog.objs.push(sun)
    /*
     * dyson hull */
    let hull_prog = shader.prog(gl, hullp.vert(), hullp.frag(funcs), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_norm", "samp_tex"
    ])
    let hull = meshes.isosphereOut(gl, hull_prog.id, 2)
    comps.rigidbody(hull)
    hull_prog.objs.push(hull)
    /*
     * dyson interior */
    let int_prog = shader.prog(gl, intp.vert(), intp.frag(funcs), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_col2", "samp_norm", "samp_hm", "samp_hm_nm"
    ])
    let interior = meshes.isosphereIn(gl, int_prog.id, 5)
    comps.rigidbody(interior)
    int_prog.objs.push(interior)
    /*
     * interior water */
    let intw_prog = shader.prog(gl, intwp.vert(), intwp.frag(funcs), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
    ])
    let water = meshes.isosphereIn(gl, intw_prog.id, 2)
    comps.rigidbody(water)
    intw_prog.objs.push(water)
    /*
     * tube */
    let tube_prog = shader.prog(gl, tubep.vert(), tubep.frag(funcs), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_norm"
    ])
    let tube = meshes.tube(gl, tube_prog.id, 0.7, 1*0.9, 2/3*0.9, 50)
    comps.rigidbody(tube)
    tube_prog.objs.push(tube)
    /*
     * stars
     */
    let stars_prog = shader.prog(gl, starsp.vert(), starsp.frag(), [
      "P", "cam_rota", "cam_trans"
    ])
    const _rand = Math.random
    const n = 1000
    let _attribs = [{
      name: "pos", stride: 2, div: 0, data: [
        -1,1, 1,1, 1,-1,
        -1,1, 1,-1, -1,-1,
      ]
    }, {
      name: "cam_pos", stride: 3, div: n, data: [...cam.pos]
    }]

    let _offs = []
    for(let i=0; i<n; ++i) {
      const phi = math.lerp(0, 2*Math.PI, _rand(), 1)
      const theta = math.lerp(0, Math.PI, _rand(), 1)
      _offs.push(...math.polar3(10,phi,theta))
    }
    _attribs.push({ name: "offs", stride: 3, div: 1, data: _offs })

    let _scale = []
    for(let i=0; i<n; ++i) {
      const s = math.lerp(1, 7, _rand(), 1)
      _scale.push(s)
    }
    _attribs.push({ name: "scale", stride: 1, div: 1, data: _scale })

    let _col = []
    for(let i=0; i<n; ++i) {
      _col.push(_rand(), _rand(), _rand())
    }
    _attribs.push({ name: "col", stride: 3, div: 1, data: _col })

    let stars = meshes.staticInstanced(gl, stars_prog.id, _attribs, 6, n)
    comps.dummy(stars)
    stars_prog.objs.push(stars)


    /*
     * progs
     */
    let progs = [
      stars_prog,
      ship_prog,
      //tube_prog,
      //int_prog,
      //intw_prog,
      ////statics_prog,
      //sun_prog,
      //hull_prog
    ]

    const setScale = (target, s) => {
      target.size[0] = s
      target.size[1] = s
      target.size[2] = s
      if(target.size_t) {
        target.size_t[0] = s
        target.size_t[1] = s
        target.size_t[2] = s
      }
    }
    const max_scale = 10000
    ship.pos[2] = 8
    ship.pos_t[2] = 8
    //ship.pos[2] = 0.76*max_scale
    //ship.pos_t[2] = 0.76*max_scale
    setScale(ship, 0.1)
    tube.pos[2] = 1.6
    tube.pos_t[2] = 1.6

    const th = 0.01
    const dt = 0.1
    function renderLoop(ts) {
      vue.$forceUpdate()

      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

      // game logic goes here
      // scale sphere depending on distance
      const dist = vec.length(vec.diff(ship.pos, hull.pos))
      vue.ship.distToNull = dist/max_scale
      const s = max_scale-dist
      if(dist >= max_scale) {
        setScale(interior, 1.5)
        setScale(water, 1.4)
        setScale(sun, 1)
        setScale(tube, 1)
        setScale(hull, 2)
      }
      if (dist < max_scale && dist >= max_scale*0.75) {
        setScale(sun, 1.5*s)
        setScale(interior, 1.5*s)
        setScale(water, 1.5*s)
        setScale(tube, s)
        setScale(hull, 2*s)
      }
      if (dist < max_scale*0.4) {
        acc = 3
        const t = vec.norm(vec.diff(sun.pos,ship.pos))
        const r = vec.norm(ship.right)
        const f = vec.norm(ship.forward)
        const ta = Math.PI/2

        const datr = ta - Math.acos(vec.dot(t,r))
        if(Math.abs(datr) > th) {
          //ship.addRota(-datr*dt*4, f)
        }
        const datf = ta - Math.acos(vec.dot(t,f))
        if(Math.abs(datf) > th) {
          //ship.addRota(datf*dt*4, r)
        }
      }

      // render objects
      for(let p=0; p<progs.length; ++p) {
        let prog = progs[p]
        gl.useProgram(prog.id)
        /*
         * push res */
        gl.uniform2fv(prog.locs["res"], res)
        /*
         * push time */
        gl.uniform1f(prog.locs["time"], ts)
        /*
         * push light */
        gl.uniform3fv(prog.locs["light"], [0,0,0])
        /*
         * push cam uniforms */
        cam.pushPerspective(prog.locs["P"], 2*dist)
        cam.pushView(prog.locs["cam_trans"], prog.locs["cam_rota"])
        cam.update(dt, th)
        /* 
         * push objs */
        let {objs, locs} = prog
        for(let o=0; o<objs.length; ++o) {
          let obj = objs[o]
          const data = { 
            pos: {
              loc: locs["obj_trans"],
              data: obj.getTrans()
            },
            rota: {
              loc: locs["obj_rota"],
              data: obj.getRota()
            },
            size: {
              loc: locs["obj_scale"],
              data: obj.getScale()
            },
          }
          obj.update(dt, th)
          obj.draw(data)
        }
      }
      requestAnimationFrame(renderLoop)
    }

    // start once all assets finished loading
    const render =  function() {
      // upload textures to gpu
      shader.texture(gl, int_prog.id, 1, int_prog.locs["samp_col"],
        assets.get("grass")
      )
      shader.texture(gl, int_prog.id, 9, int_prog.locs["samp_col2"],
        assets.get("hull")
      )
      shader.cubemap(gl, int_prog.id, 2, int_prog.locs["samp_hm"], {
        px: assets.get("int_hm"),
        nx: assets.get("int_hm"),
        py: assets.get("int_hm"),
        ny: assets.get("int_hm"),
        pz: assets.get("int_hm"),
        nz: assets.get("int_hm"),
      })
      shader.cubemap(gl, int_prog.id, 3, int_prog.locs["samp_hm_nm"], {
        px: assets.get("int_hm_nm"),
        nx: assets.get("int_hm_nm"),
        py: assets.get("int_hm_nm"),
        ny: assets.get("int_hm_nm"),
        pz: assets.get("int_hm_nm"),
        nz: assets.get("int_hm_nm"),
      })
      shader.texture(gl, ship_prog.id, 7, ship_prog.locs["samp_col"],
        assets.get("ship")
      )
      shader.texture(gl, tube_prog.id, 6, tube_prog.locs["samp_col"],
        assets.get("hull")
      )
      shader.texture(gl, hull_prog.id, 5, hull_prog.locs["samp_col"],
        assets.get("hull")
      )
      requestAnimationFrame(renderLoop)
    }
    assets.img("star", "img/nova.png",render)

    assets.img("int_hm", "img/int_hm.png",render)
    assets.img("int_hm_nm", "img/int_hm.nm.png",render)
    assets.img("grass", "img/grass.png", render)
    assets.img("tree1", "img/tree1.png", render)

    assets.img("ship", "img/ship.png",render)

    assets.img("hull", "img/hull.png", render)

    assets.img("solid", "img/solid.png", render)
    assets.img("hsv", "img/hsv.png", render)
    assets.img("bayer", "img/bayer.png", render)
  },
}
</script>

<style scoped>
html, body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  position: relative;
}

canvas {
  border: 1px solid grey;
  width: 100%;
  height: 100%;
}

#debug {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: whitesmoke;
  padding: 10px;
  background-color: #000d;
  font-size: 75%;
}
</style>

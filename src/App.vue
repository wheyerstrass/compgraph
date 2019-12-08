<template>
  <div id="app" class="p-1">
    <canvas :id="canvasId"
      :width="w"
      :height="h">
    </canvas>
    <div id="debug">
      <!-- <p><b>pos: </b>{{pos}}</p> -->
      <b>dist-to-0:</b> {{distToNull}}
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

import dbp from "@/debug.glsl.js"
import phong from "@/phong.glsl.js"
import sunp from "@/sun.glsl.js"
import hullp from "@/dyson-hull.glsl.js"
import intp from "@/dyson-interior.glsl.js"
import bgp from "@/bg.glsl.js"
import shipp from "@/ship.glsl.js"
import tubep from "@/dyson-port.glsl.js"

import matrix from "@/matrix.js"
import quat from "@/quat.js"
import vec from "@/vec.js"

export default {
  name: 'home',
  data() {
    return {
      w: 1024,
      h: 576,
      ship: {pos: [-1,-1,-1], pos_t: [-1,-1,-1], distToNull: -1}
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
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false })
    if(!gl) {
      console.error("Keine WebGL 2 Unterstützung")
      return
    }

    /*
     * gl settings */
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0.7, 0.7, 0.9, 1)

    /*
     * ship */
    let ship_prog = shader.prog(gl, shipp.vert(), shipp.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_norm"
    ])
    let ship = meshes.ship(gl, ship_prog.id)
    ship_prog.objs.push(ship)
    comps.rigidbody(ship)

    /*
     * cam */
    let cam = camera(gl, canvas.clientWidth/canvas.clientHeight, 0.1)
    cam.orbitControls(ship, 30)
    
    let acc = 1
    input.keydown({
      "w": () => (ship.vel[2] = 1*acc),
      "s": () => (ship.vel[2] = -1),
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
      cam.dist_t = Math.max(cam.dist_t, 1)
    })
    /*
     * shader programs 
     */

    /*
     * sun */
    let sun_prog = shader.prog(gl, sunp.vert(), sunp.frag(), [
      "time",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_col2"
    ])
    let sun = meshes.quad(gl, sun_prog.id)
    comps.billboard(sun, cam)
    sun_prog.objs.push(sun)
    /*
     * bg */
    let bg_prog = shader.prog(gl, bgp.vert(), bgp.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "spacenoise"
    ])
    let bg = meshes.bgquad(gl, bg_prog.id)
    comps.dummy(bg)
    bg_prog.objs.push(bg)
    /*
     * dyson hull */
    const phongf = phong(.2,.5,.9)
    let hull_prog = shader.prog(gl, hullp.vert(), hullp.frag(phongf), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_norm", "samp_tex"
    ])
    let hull = meshes.sphereOut(gl, hull_prog.id, 5)
    comps.rigidbody(hull)
    hull_prog.objs.push(hull)
    /*
     * dyson interior */
    let int_prog = shader.prog(gl, intp.vert(), intp.frag(phongf), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_norm", "samp_hm"
    ])
    let interior = meshes.sphereIn(gl, int_prog.id, 6)
    comps.rigidbody(interior)
    int_prog.objs.push(interior)
    /*
     * tube */
    let tube_prog = shader.prog(gl, tubep.vert(), tubep.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col", "samp_norm"
    ])
    let tube = meshes.tube(gl, tube_prog.id, 1.2, 1*0.9, 2/3*0.9, 50)
    comps.rigidbody(tube)
    tube_prog.objs.push(tube)

    let progs = [
      bg_prog,
      ship_prog,
      tube_prog,
      int_prog,
      sun_prog,
      hull_prog
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
    setScale(sun, 10)
    ship.pos[2] = 0.76*max_scale
    ship.pos_t[2] = 0.76*max_scale
    //ship.pos[2] = max_scale
    //ship.pos_t[2] = max_scale
    setScale(interior, 1.5)
    setScale(tube, 1)
    tube.pos[2] = 1.3
    tube.pos_t[2] = 1.3
    setScale(hull, 2)
    //interior.torq[2] = 0.02
    //tube.torq[2] = 0.02
    //hull.torq[2] = 0.02

    const th = 0.01
    const dt = 0.1
    function renderLoop(ts) {
      vue.$forceUpdate()

      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

      // game logic goes here
      // scale sphere depending on distance
      const dist = vec.length(vec.diff(ship.pos, hull.pos))
      vue.ship.distToNull = dist
      const s = max_scale-dist
      if(dist >= max_scale) {
        setScale(interior, 1.5)
        setScale(sun, 1)
        setScale(tube, 1)
        setScale(hull, 2)
      }
      if (dist < max_scale && dist >= max_scale*0.75) {
        setScale(sun, 0.1*s)
        setScale(interior, 1.5*s)
        setScale(tube, s)
        setScale(hull, 2*s)
      }
      if (dist < max_scale*0.75) {
        acc = 5
      }

      // render objects
      for(let p=0; p<progs.length; ++p) {
        let prog = progs[p]
        gl.useProgram(prog.id)
        /*
         * push time */
        gl.uniform1f(prog.locs["time"], ts)
        /*
         * push light */
        gl.uniform3fv(prog.locs["light"], [0,0,0])
        /*
         * push cam uniforms */
        cam.pushPerspective(prog.locs["P"])
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
      shader.texture(gl, sun_prog.id, 9, sun_prog.locs["samp_col"],
        assets.get("sun")
      )
      shader.texture(gl, sun_prog.id, 8, sun_prog.locs["samp_col2"],
        assets.get("nova")
      )
      shader.cubemap(gl, bg_prog.id, 0, bg_prog.locs["spacenoise"], {
        px: assets.get("spacenoise"),
        nx: assets.get("spacenoise"),
        py: assets.get("spacenoise"),
        ny: assets.get("spacenoise"),
        pz: assets.get("spacenoise"),
        nz: assets.get("spacenoise"),
      })
      shader.texture(gl, int_prog.id, 1, int_prog.locs["samp_col"],
        assets.get("grass")
      )
      shader.cubemap(gl, int_prog.id, 2, int_prog.locs["samp_hm"], {
        px: assets.get("int_hm"),
        nx: assets.get("int_hm"),
        py: assets.get("int_hm"),
        ny: assets.get("int_hm"),
        pz: assets.get("int_hm"),
        nz: assets.get("int_hm"),
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
    assets.img("sun", "img/sun.png",render)
    assets.img("nova", "img/nova.png",render)

    assets.img("int_hm", "img/int_hm.png",render)
    assets.img("grass", "img/grass.jpg", render)

    assets.img("ship", "img/ship.png",render)

    assets.img("hull", "img/hull.png", render)
    assets.img("hull2", "img/hull2.jpg", render)

    assets.img("spacenoise", "img/spacenoise.png", render)
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
  color: whitesmoke;
  padding: 10px;
  background-color: #000d;
  font-size: 75%;
}
</style>

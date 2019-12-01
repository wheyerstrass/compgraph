<template>
  <div id="app" class="p-1">
    <canvas :id="canvasId"
      :width="w"
      :height="h">
    </canvas>
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
import hullp from "@/dyson-hull.glsl.js"
import intp from "@/dyson-interior.glsl.js"
import bgp from "@/bg.glsl.js"
import shipp from "@/ship.glsl.js"

export default {
  name: 'home',
  data() {
    return { w: 1024, h: 576 }
  },
  computed: {
    canvasId() { return `canvas-${Date.now()}` }
  },
  methods: {
  },
  beforeDestroy() {
    //window.removeEventListener("keydown")
  },
  mounted() {
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
    gl.viewport(0, 0, this.w, this.h)
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
    comps.addRigidBody(ship)

    /*
     * cam */
    let cam = camera(gl, this.w/this.h, 0.1)
    cam.orbitControls(ship.pos, 10, [0,0,0])
    
    input.keydown({
      "w": () => (ship.vel[2] = 1),
      "s": () => (ship.vel[2] = -1),
      "a": () => (ship.addRota(-10, ship.up)),
      "d": () => (ship.addRota(10, ship.up)),
      " ": () => (ship.vel[1] = 1),
      "c": () => (ship.vel[1] = -1),
    })
    input.keyup({
      "w": () => (ship.vel[2] = 0),
      "s": () => (ship.vel[2] = 0),
      "a": () => (ship.vel[0] = 0),
      "d": () => (ship.vel[0] = 0),
      " ": () => (ship.vel[1] = 0),
      "c": () => (ship.vel[1] = 0),
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
     * bg */
    let bg_prog = shader.prog(gl, bgp.vert(), bgp.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_nor"
    ])
    let bg = meshes.bgquad(gl, bg_prog.id, [0,0,0.5,0.5])
    bg_prog.objs.push(bg)
    /*
     * dyson hull */
    const phongf = phong(.2,.5,.9)
    let hull_prog = shader.prog(gl, hullp.vert(), hullp.frag(phongf), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_norm"
    ])
    let hull = meshes.sphereOut(gl, hull_prog.id,
      500, 5, [200,700,-5000], [1,0,0,90])
    hull_prog.objs.push(hull)
    /*
     * dyson interior */
    let int_prog = shader.prog(gl, intp.vert(), intp.frag(phongf), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_norm"
    ])
    let interior = meshes.sphereIn(gl, int_prog.id,
      800, 4, [0,0,-110], [1,0,0,-90])
    int_prog.objs.push(interior)
    /*
     * tube */
    let tube_prog = shader.prog(gl, dbp.vert(), dbp.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_norm"
    ])
    let tube = meshes.tube(gl, tube_prog.id,
      800, 420, 280, 30, [0,0,580], [1,1,1,0])
    tube_prog.objs.push(tube)
    tube_prog.objs.push(meshes.tube(gl, tube_prog.id,
      600, 280, 110, 30, [0,0,480], [1,1,1,0])
    )
    /*
     * plane */
    let plane_prog = shader.prog(gl, dbp.vert(), dbp.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_norm"
    ])
    plane_prog.objs.push(meshes.plane(gl, plane_prog.id,5000,[0,-10,0],[1,0,0,0]))

    let progs = [
      bg_prog,
      ship_prog,
      plane_prog,
      //bg_prog,,
      //tube_prog,
      //int_prog,
      //hull_prog
    ]
    function renderLoop(ts) {
      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

      // game logic goes here
      for(let p=0; p<progs.length; ++p) {
        let prog = progs[p]
        gl.useProgram(prog.id)
        /*
         * push time */
        gl.uniform1f(prog.locs["time"], ts)
        /*
         * push light */
        gl.uniform3fv(prog.locs["light"], [50,0,0])
        /*
         * push cam uniforms */
        cam.pushPerspective(prog.locs["P"])
        cam.pushView(prog.locs["cam_trans"], prog.locs["cam_rota"])
        cam.update()
        /* 
         * push objs */
        let {objs, locs} = prog
        for(let o=0; o<objs.length; ++o) {
          let obj = objs[o]
          const ctx = { 
            cam,
            trans_loc: locs["obj_trans"],
            rota_loc: locs["obj_rota"],
            proj_loc: locs["P"],
            pos: obj.pos,
            rota: obj.rota
          }
          obj.update()
          obj.preDraw(ctx)
          obj.draw(ctx)
        }
      }
      requestAnimationFrame(renderLoop)
    }

    // start once all assets finished loading
    const render =  function() {
      // load textures
      shader.cubemap(gl, ship_prog.id, 0, ship_prog.locs["samp_col"], {
        px: assets.get("ship"),
        nx: assets.get("ship"),
        py: assets.get("ship"),
        ny: assets.get("ship"),
        pz: assets.get("ship"),
        nz: assets.get("shipfront"),
      })
      shader.cubemap(gl, hull_prog.id, 1, hull_prog.locs["samp_col"], {
        px: assets.get("hull"),
        nx: assets.get("hull"),
        py: assets.get("hull"),
        ny: assets.get("hullbot"),
        pz: assets.get("hull"),
        nz: assets.get("hull"),
      })
      shader.cubemap(gl, int_prog.id, 2, int_prog.locs["samp_col"], {
        px: assets.get("hull"),
        nx: assets.get("hull"),
        py: assets.get("hull"),
        ny: assets.get("hullbot"),
        pz: assets.get("hull"),
        nz: assets.get("hull"),
      })
      shader.texture(gl, tube_prog.id, 3, tube_prog.locs["samp_col"],
        assets.get("hull")
      )
      shader.texture(gl, plane_prog.id, 3, plane_prog.locs["samp_col"],
        assets.get("hull")
      )
      requestAnimationFrame(renderLoop)
    }
    assets.img("hull", "img/hull/albedo.png", render)
    assets.img("hullbot", "img/hull/bot.png", render)
    assets.img("grass", "img/grass/albedo.png",render)
    assets.img("grassbot", "img/grass/bot.png", render)
    assets.img("ship", "img/ship/base.png",render)
    assets.img("shipfront", "img/ship/front.png", render)
  },
}
</script>

<style scoped>
code {
  display: block;
  padding: 15px;

  border: 1px solid grey;
  background-color: whitesmoke;
}

canvas {
  border: 1px solid grey;
}
pre {
  white-space: break-spaces;
}
</style>

export default {
  render(gl, cam, progs) {
    /*
     *
     */
    function renderLoop(ts) {
      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

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
        cam.pushTranslation(prog.locs["cam_trans"])
        cam.pushRotation(prog.locs["cam_rota"])
        cam.update()
        /* 
         * push objs */
        let {objs, locs} = prog
        for(let o=0; o<objs.length; ++o) {
          const ctx = { 
            cam,
            trans_loc: locs["obj_trans"],
            rota_loc: locs["obj_rota"],
            proj_loc: locs["P"],
            uv_offset_loc: locs["uv_offset"],
          }
          let obj = objs[o]
          obj.preDraw(ctx)
          obj.draw(ctx)
        }
      }

      requestAnimationFrame(renderLoop)
    }
    requestAnimationFrame(renderLoop)
  }
}

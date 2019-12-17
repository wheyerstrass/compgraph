    /*
     * statics */
    let statics_prog = shader.prog(gl, staticsp.vert(), staticsp.frag(), [
      "time",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota", "obj_scale",
      "samp_col"
    ])
    let s_bufs = [
      {data: [
        -1,1,
        1, 1,
        1,-1,
        -1,1,
        1,-1,
        -1,-1,
      ], name: "pos", stride: 2, div: 0},
      {data: [
        0,1,
        1,1,
        1,0,
        0,1,
        1,0,
        0,0,
      ], name: "uv", stride: 2, div: 0},
    ]
    let rdata = []
    const n=1000
    const a=Math.PI/2
    for(let i=0; i<n; ++i) {
      rdata.push(i*n/a, i*n/a)
    }
    let _rd = {data:rdata,name:"offset",stride:2,div:1}
    s_bufs.push(_rd)
    let statics = meshes.staticInstanced(gl, statics_prog.id, s_bufs, 6, n)
    comps.dummy(statics)
    statics.getTrans = () => matrix.translate([0,0,0])
    statics.size = [1,1,1]
    statics.getScale = () => matrix.scale(statics.size)
    statics_prog.objs.push(statics)

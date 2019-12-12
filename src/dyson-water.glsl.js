export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;
uniform mat4 obj_scale;

out vec3 v_pos;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans*obj_scale;
  mat4 VM = V * M;

  v_pos = pos;
  gl_Position = P * VM * vec4(pos, 1.0);
}
`,

  frag: (funcs="") =>
`#version 300 es

precision mediump float;

in vec3 v_pos;

out vec4 color;

${funcs}

void main() {
  color = vec4(0.0,0.4,1.0,0.5);
  if(v_pos.z > 0.85)
    color.a = 0.0;
}
`
}

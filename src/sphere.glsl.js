export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;

uniform vec3 light;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;
uniform mat4 obj_scale;

out vec3 v_pos;
out vec3 v_nor;
out vec3 v_light;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  v_light = (P*V * vec4(10,10,10,0)).xyz;
  v_nor = (P*VM * vec4(pos, 0.0)).xyz;
  gl_Position = P * VM * vec4(pos, 1.0);
  v_pos = gl_Position.xyz;
}
`,

  frag: (funcs="") =>
`#version 300 es

precision mediump float;

in vec3 v_pos;
in vec3 v_nor;
in vec3 v_light;

out vec4 color;

${funcs}

void main() {
  float li = phong(v_light, v_pos, normalize(v_nor));
  color = vec4(li,li,li,1.0);
}
`
}

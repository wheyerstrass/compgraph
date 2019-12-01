export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;
in vec2 uv;

uniform float time;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

out vec3 vert_pos;
out vec2 vert_uv;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = uv;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  //vert_pos.y += 0.5*cos(0.001*time);
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec2 vert_uv;
in vec3 vert_pos;

uniform sampler2D samp_col;

out vec4 color;

void main() {
  //color = vec4(0.1,0.1,0.1,1.0);
  color = texture(samp_col, 0.01*vert_uv);
}
`
}

export default {
  vert: () =>
`#version 300 es

precision mediump float;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;
uniform mat4 obj_scale;

in vec2 pos;

out vec3 v_pos;

void main() {
  mat4 M = obj_trans*obj_rota*obj_scale;
  mat4 V = cam_rota;
  mat4 VM = V * M;

  v_pos = vec3(pos,0);
  gl_Position = P * VM * vec4(v_pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

uniform float time;
uniform sampler2D samp_col;

in vec3 v_pos;

out vec4 color;

void main() {

  float d = distance(v_pos.xy,vec2(0));
  vec4 c = vec4(1.0,0.5,0.4,0.001)/d;
  vec4 b = vec4(0,0,0,1.0);
  vec4 cb = c.rgba*c.a + b.rgba*b.a;
  vec4 tex = texture(samp_col, 8.0*v_pos.xy);
  color = vec4(cb);
}
`
}

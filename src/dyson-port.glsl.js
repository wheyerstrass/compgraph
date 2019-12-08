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
uniform mat4 obj_scale;

out vec3 vert_n;
out vec3 vert_pos;
out vec2 vert_uv;

void main() {
  mat4 M = obj_scale*obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = uv;
  vert_n = pos;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec2 vert_uv;
in vec3 vert_pos;
in vec3 vert_n;

uniform sampler2D samp_col;

out vec4 color;

void main() {
  vec3 coords = vert_n;
  vec3 n = abs(normalize(vert_n));
  n = normalize(max(n, 0.00001));
  float b = n.x + n.y + n.z;
  n /= vec3(b,b,b);

  vec4 xa = texture(samp_col, n.yz);
  vec4 ya = texture(samp_col, n.xz);
  vec4 za = texture(samp_col, n.xy);
  vec4 tex = xa*n.x + ya*n.y + za*n.z;

  float z = gl_FragCoord.z*2. - 1.;
  z = (2.*0.1*10000.) / (10000.+0.1 - z*(10000.-0.1)) / 2000.;

  color = tex;
}
`
}

export default {
  vert: () =>
`#version 300 es

precision mediump float;

uniform mat4 P;
uniform mat4 obj_rota;

in vec2 pos;

out vec3 vert_uv;

void main() {
  vec3 f = vec3(1./P[0][0], 1./P[1][1], 0.);
  vec3 _pos = vec3(pos, 0.)*f - vec3(0,0,1);
  vert_uv = mat3(obj_rota) * normalize(_pos);
  gl_Position = vec4(pos, 0., 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

uniform float time;
uniform samplerCube samp_col;

in vec3 vert_uv;

out vec4 color;

void main() {
  color = texture(samp_col, normalize(vert_uv));
}
`
}

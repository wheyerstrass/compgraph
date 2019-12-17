export default {
  vert: () =>
`#version 300 es

precision mediump float;

uniform mat4 P;
uniform mat4 cam_rota;

in vec2 pos;

out vec3 vert_uv;

void main() {
  vec3 f = vec3(1./P[0][0], 1./P[1][1], 0.);
  vec3 _pos = vec3(pos, 0.)*f - vec3(0,0,1);
  vert_uv = mat3(transpose(cam_rota)) * normalize(_pos);
  gl_Position = vec4(pos, 0., 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

uniform float time;
uniform sampler2D samp_col;

in vec3 vert_uv;

out vec4 color;

void main() {

  float d = distance(vert_uv.xy,vec2(0));
  //d = (1.-clamp(d,0.,1.));
  //d = pow(d,8.);
  vec4 c = vec4(1.0,0.4,0.3,0.05)/d;
  vec4 b = vec4(0,0,0,1);
  
  vec4 cb = c.rgba*c.a + b.rgba*b.a;

  vec4 clouds = texture(samp_col, vert_uv.xy);

  color = vec4(cb);
}
`
}

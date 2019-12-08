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
uniform samplerCube spacenoise;

in vec3 vert_uv;

out vec4 color;

void main() {
  vec4 noise = texture(spacenoise, vert_uv);
  float ofs = sqrt(length(gl_FragCoord.xy));
  vec3 b = 1.5*noise.rgb-0.7 * clamp(cos(0.1*time+ofs), 0.5, 1.0);
  color = vec4(b, 1.0);
}
`
}

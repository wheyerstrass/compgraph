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
  vert_pos = pos;
  vert_uv = ((pos+1.)/2.).xy;
  gl_Position = vec4(pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec2 vert_uv;
in vec3 vert_pos;

uniform float time;

uniform sampler2D spacenoise;

out vec4 color;

void main() {
  vec3 hsv = texture(spacenoise, vert_uv).rgg;
  vec3 cloud = texture(spacenoise, vert_uv).bbb;

  float mask = clamp(cloud.g-0.2, 0.0, 1.0);
  float ofs = length(gl_FragCoord);
  float t = clamp(cos(0.002*time+ofs), 0.1, 1.0);
  vec3 sv = 50.*(hsv-0.95+vec3(-0.01,0.1,0.1));
  color = vec4(mask*t*sv, 1.0);
}
`
}

export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec2 pos;
in vec2 uv;

//uniform vec4 uv;

out vec2 vert_uv;

void main() {
  vert_uv = uv;
  gl_Position = vec4(pos, 0., 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

uniform float time;
in vec2 vert_uv;

uniform sampler2D samp_col;
uniform vec2 uv_offset;

out vec4 color;

void main() {
  color = texture(samp_col, vert_uv+uv_offset);
}
`
}

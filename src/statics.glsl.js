export default {
  vert: () =>
`#version 300 es

precision mediump float;

uniform mat4 P;
uniform mat4 cam_rota;
uniform mat4 cam_trans;

uniform mat4 obj_trans;
uniform mat4 obj_scale;

vec3 xrot(in vec3 pos, in float a) {
  mat3 rot = mat3(1, 0, 0,
                 0, cos(a), -sin(a),
                 0, sin(a), cos(a));
  return rot*pos;
}

vec3 yrot(in vec3 pos, in float a) {
  mat3 rot = mat3(cos(a), 0, sin(a),
                 0, 1, 0,
                 -sin(a), 0, cos(a));
  return rot*pos;
}

vec3 zrot(in vec3 pos, in float a) {
  mat3 rot = mat3(cos(a), -sin(a), 0,
                 sin(a), cos(a), 0,
                 0, 0, 1);
  return rot*pos;
}

// attributes
in vec2 uv;
in vec3 pos;
in vec2 offset;

out vec2 v_uv;
out vec3 v_pos;

void main() {
  v_uv = uv;
  v_pos = pos;
  mat4 MVP = P*cam_rota*cam_trans;

  float s = obj_scale[0][0];
  mat3 _s = 0.01*mat3(
    s,0,0,
    0,s,0,
    0,0,s);

  vec3 _t = vec3(0,-0.0251*s,0);
  vec3 p = _s * (pos+_t);
  p = zrot(p, -15.*offset.x);
  p = xrot(p, -15.*offset.y);

  gl_Position = MVP * vec4(p, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec2 v_uv;
in vec3 v_pos;

uniform sampler2D samp_col;

out vec4 color;

void main() {
  vec4 tex = texture(samp_col, 1.-v_uv);
  color = vec4(tex.rgb, tex.a);
  //color = vec4(1,1,1,1);
}
`
}

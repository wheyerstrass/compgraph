export default {
  vert: () =>
`#version 300 es

precision mediump float;

uniform mat4 P;
uniform mat4 cam_rota;
uniform mat4 cam_trans;

in vec2 pos;
// instanced
in vec3 col;
in vec3 offs;
in float scale;
in vec3 cam_pos;

out vec3 v_pos;
out vec3 v_col;
out float v_scale;

const vec3 _up = vec3(0,1,0);
mat3 lookat0(in vec3 from, in vec3 to) {
    vec3 f = normalize(to-from);
    vec3 s = normalize(cross(f,_up));
    vec3 u = normalize(cross(s, f));
    return mat3(
      s.x, u.x, -f.x,
      s.y, u.y, -f.y,
      s.z, u.z, -f.z
    );
}

void main() {
  v_col = col;
  v_scale = scale;
  v_pos = vec3(pos,0);
  mat3 rota = lookat0(offs, -cam_pos);
  vec3 fpos = transpose(rota) * v_pos;
  gl_Position = P * cam_rota * vec4(fpos+offs, 1);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec3 v_pos;
in vec3 v_col;
in float v_scale;

out vec4 color;

void main() {

  float d = distance(v_pos.xy,vec2(0));
  vec4 c = vec4(v_col, 0.001*v_scale)/d;
  vec4 b = vec4(0,0,0,1.0);
  vec4 cb = c.rgba*c.a + b.rgba*b.a;
  color = cb;
}
`
}

export default (r, g, b) => `
vec3 fog(in vec3 col, in float dist, in float dens) {
  float fog_a = 1.0 - exp(-dist*dens);
  vec3 fog_c = vec3(${r}, ${g}, ${b});
  return mix(col, fog_c, fog_a);
}
`

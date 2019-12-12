export default (ka, kd, ks) => `
float phong(in vec3 light, in vec3 vpos, in vec3 vnorm) {

  vec3 nl = normalize(light-vpos);
  vec3 nn = normalize(vnorm);
  vec3 np = normalize(-vpos);

  // ambient
  float Ia = ${ka};

  // diffuse (lambert)
  float Id = ${kd} * max( dot(nl, nn), 0.0 );

  // specular (blinn-phong)
  float rv = dot(nn, normalize(nl+np));
  float Is = ${ks} * pow(rv, 4.);

  return (Ia+Id+Is);
}
`

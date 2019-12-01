export default {

  lint(from, to, alpha, threshold) {
    const diff = to - from
    return (Math.abs(diff) > threshold) ? alpha*diff : 0
  },

  rad(deg) {
    return deg*Math.PI/180
  }
}

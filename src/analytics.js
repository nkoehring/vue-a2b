
function mixpanel (name, winner, countdown=100) {
  if (window.mixpanel) {
    var super_property = {}
    super_property['A/B ' + name] = winner
    window.mixpanel.register_once(super_property)
  } else {
    // loop until mixpanel is loaded
    setTimeout(() => mixpanel(name, winner, countdown - 1), 1000)
  }
}

export default {
  mixpanel
}

module.exports = function createLog(name) {
  function logger(messgae) {
    return ` -- ${name} --> ${messgae}`
  }
  return logger
}
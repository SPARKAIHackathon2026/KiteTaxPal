const bindings = new Map(); // demo 用，之后可换 DB

export function saveBinding(binding) {
  bindings.set(binding.userAddress, binding);
}

export function getBinding(userAddress) {
  return bindings.get(userAddress);
}

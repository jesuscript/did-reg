
export default enumerate([
  "ID_STATUS_TAKEN",
  "ID_STATUS_OWN",
  "ID_STATUS_FREE",
  "ID_STATUS_UNKNOWN"
])



function enumerate(arr){
  return _.reduce(arr, function(e, v){
    e[v] = v
    return e
  },{});
}

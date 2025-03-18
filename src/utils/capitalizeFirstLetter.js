// function capitalizeFirstLetter(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// }

function capitalizeFirstLetter(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default capitalizeFirstLetter;

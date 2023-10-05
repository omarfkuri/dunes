/** Extract item at `n` from `arr`*/
function extract(arr, n) {
  let el = arr[n];
  const elAt = arr.length > n;
  for (let i = n; i < arr.length; i++) {
    arr[i] = arr[i + 1];
  }
  if (elAt) arr.pop();
  return el;
}

var styles = {
  "name": "subdir_96_name"
};

const div = extract([1, 2, 3], 1);
console.log(div, styles);

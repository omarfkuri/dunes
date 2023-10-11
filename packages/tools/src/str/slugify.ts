const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
const p = new RegExp(a.split('').join('|'), 'g');

export function slugify(string: string) {
  return string.toLowerCase()
  // Replace spaces with -
  .replace(/\s+/g, '-')
  // Replace special characters
  .replace(p, c => b.charAt(a.indexOf(c)))
  // Replace & with 'and'
  .replace(/&/g, '-and-')
  // Remove all non-word characters
  .replace(/[^\w\-]+/g, '')
  // Replace multiple - with single -
  .replace(/\-\-+/g, '-')
  // Trim - from start of text
  .replace(/^-+/, '')
  // Trim - from end of text
  .replace(/-+$/, '');
}

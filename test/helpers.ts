export function createHTML(content) {
  const div = document.createElement('div');
  div.innerHTML = content;
  return <HTMLElement>div.firstElementChild;
}

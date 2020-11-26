export function createHTML(content: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = content;
  return div.firstElementChild as HTMLElement;
}

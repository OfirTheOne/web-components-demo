const isDOMParserSupport = (function () {
	if (!window.DOMParser) return false;
	var parser = new DOMParser();
	try {
		parser.parseFromString('x', 'text/html');
	} catch(err) {
		return false;
	}
	return true;
})();

export function parseHTML(container: HTMLElement,  str: unknown) {
  const content = str as string;
  // If DOMParser is supported, use it
  if (isDOMParserSupport) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    container.append(...doc.body.childNodes);
    return container; //.querySelector('') as HTMLElement;
  }

  // Otherwise, fallback to old-school method
  const dom = document.createElement('div');
  dom.innerHTML = content;
  return dom;

}


export function withContainer(container: HTMLElement) {
    return (str: unknown) => parseHTML(container, str);
}


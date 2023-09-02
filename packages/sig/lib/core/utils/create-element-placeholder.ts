export const createElementPlaceholder = (tagName: string, key: string) => {
    const ph = document.createElement(tagName);
    ph.setAttribute('role', 'ph');
    ph.setAttribute('for', key);
    ph.style.display = 'none';
    ph.style.visibility = 'hidden';
    return ph;
 }
 
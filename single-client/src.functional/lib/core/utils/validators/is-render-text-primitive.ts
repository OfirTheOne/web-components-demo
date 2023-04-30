
export const isRenderTextPrimitive = (child: any): child is string | number | boolean => {
  return typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean';
}
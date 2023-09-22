

export const generateId = () => {
    return 'randomUUID' in crypto ? crypto.randomUUID() : `${Math.random()}-${Date.now()}`;
}
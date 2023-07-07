import { expect, test } from 'vitest'
import { createStore } from './create-store';

test('createStore sets and gets state correctly', () => {
    const store = createStore<{ count: number, increment: () => void }>((set, get) => {
        return {
            count: 0,
            increment: () => {
                set({ count: get().count + 1 });
            }
        }
    });
  
    store.getState().increment();
    expect(store.getState().count).toEqual(1);
  });
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

test('createStore updates state correctly', () => {
    const store = createStore<{
        count: number,
        increment: () => void,
        decrement: () => void
    }>((set, get) => {
        return {
            count: 0,
            increment: () => {
                set({ count: get().count + 1 });
            },
            decrement: () => {
                set({ count: get().count - 1 });
            }
        }
    });

    store.getState().increment();
    store.getState().increment();
    store.getState().decrement();

    expect(store.getState().count).toEqual(1);
});

test('createStore updates partial state correctly', () => {
    interface UserState {
        name: string;
        age: number;
        address: {
            street: string;
            city: string;
            zip: string;
        };
        setAddress: (address: Partial<UserState['address']>) => void;
    }

    const user: Omit<UserState, 'setAddress'> = {
        name: 'John Doe',
        age: 30,
        address: {
            street: '123 Main St',
            city: 'Anytown',
            zip: '12345'
        }
    };

    const store = createStore<UserState>((set, get) => ({
        ...user,
        setAddress: (address) => {
            set({ address: { ...get().address, ...address } });
        }
    }));

    store.getState().setAddress({ city: 'Newtown' });

    expect(store.getState().address.city).toEqual('Newtown');
    expect(store.getState().name).toEqual('John Doe');
    expect(store.getState().age).toEqual(30);
    expect(store.getState().address.street).toEqual('123 Main St');
    expect(store.getState().address.zip).toEqual('12345');
});

test('createStore update the state then reset it to initial state', () => {
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

    store.reset();
    expect(store.getState().count).toEqual(0);
});
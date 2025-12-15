import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '../src/mocks/server'

// Iniciar MSW server antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))

// Resetear handlers después de cada test
afterEach(() => server.resetHandlers())

// Cerrar el servidor después de todos los tests
afterAll(() => server.close())

// Mock para matchMedia (necesario para algunos componentes)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock para scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
})

// Mock para localStorage con funcionalidad real
const localStorageStore = {};
const localStorageMock = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, value) => { localStorageStore[key] = String(value); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { 
    for (const key in localStorageStore) {
      delete localStorageStore[key];
    }
  },
  get length() {
    return Object.keys(localStorageStore).length;
  },
  key: (index) => Object.keys(localStorageStore)[index] || null
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

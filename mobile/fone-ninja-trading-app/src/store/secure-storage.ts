import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Adaptador para o middleware `persist` do zustand usar o SecureStore do Expo
 * (Keychain no iOS / Keystore no Android) em vez do AsyncStorage puro.
 *
 * SecureStore nao existe na Web (nao ha Keychain/Keystore no navegador), entao
 * ali caimos para `localStorage` - menos seguro, mas suficiente pra esta demo.
 */
export const secureStorage = {
  getItem: (name: string) => {
    if (Platform.OS === 'web') {
      return Promise.resolve(globalThis.localStorage?.getItem(name) ?? null);
    }
    return SecureStore.getItemAsync(name);
  },
  setItem: (name: string, value: string) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(name, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: (name: string) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(name);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(name);
  },
};

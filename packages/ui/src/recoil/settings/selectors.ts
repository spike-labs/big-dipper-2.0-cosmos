import { atomState } from '@/recoil/settings/atom';
import type { Date, Theme, Tx } from '@/recoil/settings/types';
import { DATE_KEY, setItem, THEME_KEY, TX_KEY } from '@/utils/localstorage';
import { mergeStateChange } from '@/utils/merge_state_change';
import { DefaultValue, ReadOnlySelectorOptions, selector } from 'recoil';

const getTheme: ReadOnlySelectorOptions<Theme>['get'] = ({ get }): Theme => {
  const state = get(atomState);
  return state.theme;
};

export const writeTheme = selector({
  key: 'settings.write.theme',
  get: getTheme,
  set: ({ get, set }, newTheme) => {
    if (newTheme instanceof DefaultValue) return;
    setItem(THEME_KEY, newTheme);
    const prevState = get(atomState);
    const newState = mergeStateChange(prevState, {
      theme: newTheme,
    });
    set(atomState, newState);
  },
});

export const readTheme = selector({
  key: 'settings.read.theme',
  get: getTheme,
});

// =============================================
// =============================================

const getDate: ReadOnlySelectorOptions<Date>['get'] = ({ get }) => {
  const state = get(atomState);
  return state.dateFormat;
};

export const writeDate = selector({
  key: 'settings.write.date',
  get: getDate,
  set: ({ get, set }, newDate) => {
    if (newDate instanceof DefaultValue) return;
    setItem(DATE_KEY, newDate);
    const prevState = get(atomState);
    const newState = mergeStateChange(prevState, {
      dateFormat: newDate,
    });
    set(atomState, newState);
  },
});

export const readDate = selector({
  key: 'settings.read.date',
  get: getDate,
});

// =============================================
// =============================================

const getTx: ReadOnlySelectorOptions<Tx>['get'] = ({ get }): Tx => {
  const state = get(atomState);
  return state.txListFormat;
};

export const writeTx = selector({
  key: 'settings.write.tx',
  get: getTx,
  set: ({ get, set }, newTx) => {
    if (newTx instanceof DefaultValue) return;
    setItem(TX_KEY, newTx);
    const prevState = get(atomState);
    const newState = mergeStateChange(prevState, {
      txListFormat: newTx,
    });
    set(atomState, newState);
  },
});

export const readTx = selector({
  key: 'settings.read.tx',
  get: getTx,
});

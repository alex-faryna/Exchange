import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const currencies = ['UAH', 'USD', 'EUR', 'BTC'];

export interface RateValue {
    buy: number,
    sell: number
}
export interface Rate {
    initialValue: RateValue,
    value: RateValue,
}

export type ExchangeState = {
    state: 'loading' | 'error' | 'loaded',
    rates: Record<string, Rate>,
    left: string;
    right: string;
};

const initialState: ExchangeState = {
    state: 'loading',
    rates: {},
    left: currencies[0],
    right: currencies[1],
};

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        errorLoading: (state) => {
          state.state = 'error';
        },
        setRates: (state, { payload }: PayloadAction<{ key: string, initialValue: RateValue }[]> ) => {
            state.state = 'loaded';
            payload.forEach(rate => {
                state.rates[rate.key] = { initialValue: rate.initialValue, value: rate.initialValue };
            })
        },
        editRate: (state, { payload }: PayloadAction<{ key: string, value: number, buy: boolean }>) => {
            state.rates[payload.key].value[payload.buy ? 'buy' : 'sell'] = payload.value;
        },
        setSideCurrency: (state, { payload }: PayloadAction<{ side: 'left' | 'right', value: string }>) => {
            if ((payload.side === 'left' && payload.value === state.right) || (payload.side === 'right' && payload.value === state.left)) {
                const tmp = state.left;
                state.left = state.right;
                state.right = tmp;
            } else {
                state[payload.side] = payload.value;
            }
        },
        swapSides: (state) => {
            const tmp = state.left;
            state.left = state.right;
            state.right = tmp;
        }
    },

});

export const { setRates, editRate, errorLoading, setSideCurrency, swapSides } = exchangeSlice.actions;

export default exchangeSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
};

const initialState: ExchangeState = {
    state: 'loading',
    rates: {},
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
        }
    },

});

export const { setRates, editRate, errorLoading } = exchangeSlice.actions;

export default exchangeSlice.reducer;

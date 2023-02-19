import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RateValue {
    buy: number,
    sell: number
}
export interface Rate {
    initialValue: RateValue,
    value: RateValue,
}
export type ExchangeState = Record<string, Rate>;

const initialState: ExchangeState = { };

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        setRates: (state, { payload }: PayloadAction<[{ key: string, initialValue: RateValue }]> ) => {
            payload.forEach(rate => {
                state[rate.key] = { initialValue: rate.initialValue, value: rate.initialValue };
            })
        },
        editRate: (state, { payload }: PayloadAction<{ key: string, value: number, buy: boolean }>) => {
            state[payload.key].value[payload.buy ? 'buy' : 'sell'] = payload.value;
        }
    },
});

export const { setRates, editRate } = exchangeSlice.actions;

export default exchangeSlice.reducer;

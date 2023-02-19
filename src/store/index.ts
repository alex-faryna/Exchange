import {configureStore} from "@reduxjs/toolkit";
import exchangeReducer, {ExchangeState} from './exchange.state'

export interface RootState {
    exchange: ExchangeState,
}

const store = configureStore({
    reducer: {
        exchange: exchangeReducer,
    },
    middleware: [],
});

export default store;
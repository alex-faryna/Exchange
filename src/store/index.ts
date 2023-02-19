import {configureStore} from "@reduxjs/toolkit";
import exchangeReducer, {ExchangeState} from './exchange.state'

export interface RootState {
    exchange: ExchangeState,
}

const logger = (store: { getState: () => any; }) => (next: (arg0: any) => any) => (action: { type: any; }) => {
    console.group(action.type)
    console.info('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
    return result
}

const store = configureStore({
    reducer: {
        exchange: exchangeReducer,
    },
    middleware: [],
});

export default store;
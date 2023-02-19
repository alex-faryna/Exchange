import React, {ReactNode, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {HiPencil} from "react-icons/hi";
import {useDispatch, useSelector} from "react-redux";

import { setRates } from './store/exchange.state';
import state, { RootState} from "./store";

function Header() {
  return <header className='nav header'>
      <img src={ logo } className="App-logo" alt="logo" />
      <span>Exchange</span>
  </header>;
}

function Footer() {
  return <footer className='nav footer'>
      2023 All rights reserved
  </footer>;
}

// they will buy {ccy} from you for {buy}{baseCCy}
interface CurrencyRate {
    ccy: string; // from
    baseCcy: string; // to
    buy: number;
    sell: number;
}

function Cell({ children }: { children: ReactNode }) {
    return <div className='cell'>{ children }</div>;
}

// add value i guess or smth like that (when redux)
function EditableCell({ initialValue }: { initialValue: number }) {
    const [value, setValue] = useState(initialValue);
    const [edit, setEdit] = useState(false);

    const finishEditing = (value: string, strict = false) => {
        const newValue = Number(value);
        const off = initialValue / 10;

        if (newValue >= initialValue - off && newValue <= initialValue + off) {
            setValue(newValue);
        } else if(strict) {
            return;
        }
        setEdit(false);
    }

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            finishEditing(event.currentTarget.value, true);
        }
    };

    return <Cell>
        <HiPencil className={`edit-icon ${edit ? 'editing' : ''}`} onClick={() => setEdit(true)}></HiPencil>
        { edit ? <input className='field' defaultValue={value} autoFocus={true}
                        onKeyDown={handleEnter}
                        onBlur={event => finishEditing(event.target.value)}
        /> : value }
    </Cell>
}

state.dispatch(setRates([{ key: '12a3', initialValue: { buy: 27.5, sell: 32 }}]));

function RatesTable() {
    const exchangeRates = useSelector((state: RootState) => state.exchange);
    const dispatch = useDispatch();

    console.log(exchangeRates);

    const data: CurrencyRate[] = [
        { ccy: 'USD', baseCcy: 'UAH', buy: 27.5, sell: 27.7 },
        { ccy: 'EUR', baseCcy: 'UAH', buy: 32.5, sell: 32.7 },
        { ccy: 'BTC', baseCcy: 'USD', buy: 11500, sell: 11700 },
    ];

    return <div className='rates-table'>
        <Cell>Currency/Current Date</Cell>
        <Cell>Buy</Cell>
        <Cell>Cell</Cell>
        {
            data.map(row => <React.Fragment key={`${row.ccy}/${row.baseCcy}`}>
                <Cell>{row.ccy}/{row.baseCcy}</Cell>
                <EditableCell initialValue={row.buy}></EditableCell>
                <EditableCell initialValue={row.sell}></EditableCell>
            </React.Fragment>)
        }
    </div>;
}

function Converter() {
    return <span>Converter</span>
}

function App() {
  return (
    <>
      <Header></Header>
      <div className='container'>
        <RatesTable></RatesTable>
        <Converter></Converter>
      </div>
      <Footer></Footer>
    </>
  );
}

export default App;

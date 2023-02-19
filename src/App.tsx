import React, {ReactNode, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {HiPencil} from "react-icons/hi";
import {useDispatch, useSelector} from "react-redux";

import { setRates, errorLoading } from './store/exchange.state';
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

function RatesTable() {
    const exchangeRates = useSelector((state: RootState) => state.exchange.rates);

    return <div className='rates-table'>
        <Cell>Currency/Current Date</Cell>
        <Cell>Buy</Cell>
        <Cell>Cell</Cell>
        {
            Object.entries(exchangeRates).map(([key, { value }]) => <React.Fragment key={key}>
                <Cell>{key}</Cell>
                <EditableCell initialValue={value.buy}></EditableCell>
                <EditableCell initialValue={value.sell}></EditableCell>
            </React.Fragment>)
        }
    </div>;
}

function Converter() {
    return <span>Converter</span>
}

function stubData() {
    return new Promise<Record<string, string>[]>((resolve, reject) => {
        setTimeout(() => {
            resolve([
                {"ccy":"EUR","base_ccy":"UAH","buy":"40.90","sale":"41.90"},
                {"ccy":"USD","base_ccy":"UAH","buy":"39.20","sale":"39.70"},
                {"ccy":"BTC","base_ccy":"USD","buy":"11500","sale":"11700"}
            ]);
        }, 1500);
    });
}
function Container({ children }: { children: ReactNode}) {
    const exchangeState = useSelector((state: RootState) => state.exchange.state);

    let elem = children;
    if (exchangeState === 'loading') {
        elem = <p>Loading...</p>
    } else if (exchangeState === 'error') {
        elem = <p>Error!</p>
    }

    return <div className='container'>
        { elem }
    </div>;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      //fetch("http://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
      stubData()
          .then((data: Record<string, string>[]) => {
              const res = data.map(row => ({
                  key: `${row.ccy}/${row.base_ccy}`,
                  initialValue: { buy: Number(row.buy), sell: Number(row.sale) },
              }));
              dispatch(setRates(res));
          })
          .catch(error => dispatch(errorLoading()));
  }, []);

  return (
    <>
      <Header></Header>
      <Container>
          <RatesTable></RatesTable>
          <Converter></Converter>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default App;

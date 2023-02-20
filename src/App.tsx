import React, {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {HiOutlineSwitchHorizontal, HiPencil} from "react-icons/hi";
import {useDispatch, useSelector} from "react-redux";
import {
    setRates,
    errorLoading,
    editRate,
    currencies,
    setSideCurrency,
    swapSides,
    setAmount
} from './store/exchange.state';
import state, { RootState} from "./store";
import {Dropdown, DropdownButton, FormText} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {findConversionRate} from "./converter";


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

function Cell({ children }: { children: ReactNode }) {
    return <div className='cell'>{ children }</div>;
}

function EditableCell({ id, buy, value }: { id: string, buy: boolean, value: number }) {
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false);

    const finishEditing = (inputValue: string, strict = false) => {
        const newValue = Number(inputValue);
        const off = value / 10;

        if (newValue >= value - off && newValue <= value + off) {
            dispatch(editRate({ key: id, value: newValue, buy}));
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
                <EditableCell value={value.buy} buy={true} id={key}></EditableCell>
                <EditableCell value={value.sell} buy={false} id={key}></EditableCell>
            </React.Fragment>)
        }
    </div>;
}

function CurrencyDropdown({ side }: { side: 'left' | 'right' }) {
    const sideCurrency = useSelector((state: RootState) => state.exchange[side]);
    const dispatch = useDispatch();

    return <DropdownButton size="sm" id="dropdown-basic-button" title={sideCurrency}
                           onSelect={key =>  dispatch(setSideCurrency({ side, value: key! }))}>
        { currencies.map(option => <Dropdown.Item eventKey={option} key={option}>{ option }</Dropdown.Item>) }
    </DropdownButton>
}

function CurrencySide({ title, side, onInput }: { title: string, side: 'left' | 'right', onInput: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
    const exchange = useSelector((state: RootState) => state.exchange);
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (exchange.from !== side) {
            const rates = Object.entries(exchange.rates).map(([key, { value }]) => ({
                ccy: key.split('/')[0],
                base_ccy: key.split('/')[1],
                buy: `${value.buy}`,
                sale: `${value.sell}`,
            }))
            const rate = findConversionRate(rates, exchange.left, exchange.right);
            // console.log(rate);
            setValue(exchange.amount * rate);
        }
    });

    const valChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(Number(event.target.value) || 0);
        onInput(event);
    }

    return <div className='currency-side'>
        <div className='currency-title'>{title}</div>
        <div className='currency-input'>
            <Form.Control size="sm" value={value} onChange={valChanged}></Form.Control>
        </div>
        <div className='currency-select'>
            <CurrencyDropdown side={side}></CurrencyDropdown>
        </div>
    </div>
}

function Converter() {
    const dispatch = useDispatch();

    const calculate = (side: 'left' | 'right', amount: string) => {
        dispatch(setAmount({ side, amount: Number(amount) || 0 }));
    }

    return <div className='converter'>
        <CurrencySide title='Change' side='left' onInput={val => calculate('left', val.target.value)}></CurrencySide>
        <HiOutlineSwitchHorizontal className='switch-icon' onClick={() => dispatch(swapSides())}></HiOutlineSwitchHorizontal>
        <CurrencySide title='Get' side='right' onInput={val => calculate('right', val.target.value)}></CurrencySide>
    </div>
}

function stubData() {
    return new Promise<Record<string, string>[]>((resolve, reject) => {
        setTimeout(() => {
            resolve([
                {"ccy":"EUR","base_ccy":"UAH","buy":"40.90","sale":"41.90"},
                {"ccy":"USD","base_ccy":"UAH","buy":"39.20","sale":"39.70"},
                {"ccy":"BTC","base_ccy":"USD","buy":"11500","sale":"11700"}
            ]);
        }, 300);
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
          .catch(() => dispatch(errorLoading()));
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

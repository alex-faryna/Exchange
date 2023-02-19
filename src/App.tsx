import React, {ReactNode, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {HiPencil} from "react-icons/hi";

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

function EditableCell({ initialValue }: { initialValue: number }) {
    const [edit, setEdit] = useState(false);

    const finishEditing = (value: string) => {
        setEdit(false);
        console.log(value);
    }

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            finishEditing(event.currentTarget.value);
        }
    };

    return <Cell>
        <HiPencil className={`edit-icon ${edit ? 'editing' : ''}`} onClick={() => setEdit(true)}></HiPencil>
        { edit ? <input className='field' defaultValue={initialValue} autoFocus={true}
                        onKeyDown={handleEnter}
                        onBlur={event => finishEditing(event.target.value)}
        /> : initialValue }
    </Cell>
}

function RatesTable() {
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

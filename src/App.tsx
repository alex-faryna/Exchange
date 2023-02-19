import React from 'react';
import logo from './logo.svg';
import './App.css';

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

function RatesTable() {
    const data: CurrencyRate[] = [
        { ccy: 'USD', baseCcy: 'UAH', buy: 27.5, sell: 27.7 },
        { ccy: 'EUR', baseCcy: 'UAH', buy: 32.5, sell: 32.7 },
        { ccy: 'BTC', baseCcy: 'USD', buy: 11500, sell: 11700 },
    ];

    return <div className='rates-table'>
        <div className='cell'>Currency/Current Date</div>
        <div className='cell'>Buy</div>
        <div className='cell'>Cell</div>
        {
            data.map(row => <>
                <div className='cell'>{row.ccy}/{row.baseCcy}</div>
                <div className='cell'>{row.buy}</div>
                <div className='cell'>{row.sell}</div>
            </>)
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

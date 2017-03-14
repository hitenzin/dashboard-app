import React, { Component } from 'react';
import '../stylesheets/StockMarket.css';
import $ from 'jquery';
import {Popover, OverlayTrigger} from 'react-bootstrap';

class StockMarket extends Component {

  constructor() {
    super();
    this.state = {
      market: null,
      currentPrice: null,
      tickerSymbol: null,
      lastUpdate: null,
      stocks: []
    }
    this.getStockData = this.getStockData.bind(this);
    this.showData = this.showData.bind(this);
    this.moreInfo = this.moreInfo.bind(this);
  }

  componentDidMount() {
    // stock index: s&p 500, dow, nasdaq
    var indices = ['.INX', '.DJI', '.IXIC'];
    indices.map((stockIndex, idx) => {
      $.ajax({
        type: 'GET',
        dataType: 'JSONP',
        crossDomain: true,
        url: `http://finance.google.com/finance/info?client=ig&q=${stockIndex}`,
      })
      .done((response) => {
        const jsonData = response[0];
        var tickerSymbol = jsonData.t;
        // add custom name for the 3 default indices
        if (stockIndex === '.INX') {
          tickerSymbol = 'S&P 500';
        }
        if (stockIndex === '.DJI') {
          tickerSymbol = 'DOW';
        }
        if (stockIndex === '.IXIC') {
          tickerSymbol = 'NASDAQ';
        }
        var stockData = {
          'index': idx,
          'market': jsonData.e,
          'currentPrice': jsonData.l_fix,
          'tickerSymbol': tickerSymbol,
          'lastUpdate': jsonData.lt,
          'lastChange': jsonData.c
        };
        // add stock class depending on last change positive or negative
        // className used for change background to red/green
        if (jsonData.c.charAt(0) === '+') {
          stockData['stockClassName'] = 'stockGreen';
        }
        if (jsonData.c.charAt(0) === '-') {
          stockData['stockClassName'] = 'stockRed';
        }
        var stocks = this.state.stocks;
        stocks[idx] = stockData;
        this.setState({
          stocks
        })
      })
    })
  }

  // making cross origin browser request using jquery: crossDomain: true
  getStockData(e) {
    if (e.key === 'Enter') {
      $.ajax({
        type: 'GET',
        dataType: 'JSONP',
        crossDomain: true,
        url: `http://finance.google.com/finance/info?client=ig&q=${this.stockSymbol.value}`,
      })
      .done((response) => {
        const jsonData = response[0];
        this.setState({
          market: jsonData.e,
          currentPrice: jsonData.l_fix,
          tickerSymbol: jsonData.t,
          lastUpdate: jsonData.lt,
          lastChange: jsonData.c
        })
        this.stockSymbol.value = null;
      })
    }
  }

  showData() {
    if (this.state.stocks) {
      return (
        this.state.stocks.map(stock => (
            <li className={"one-stock pull-left " + stock.stockClassName} >
              <div className="stockDesc">{stock.tickerSymbol}</div>
              <div className="stockPrice">$ {stock.currentPrice}</div>
              <div>Change: {stock.lastChange}</div>
            </li>
        ))
      )
    }
  }

  moreInfo() {
    return (
      <Popover className="aboutNewsWidget" title="About 'Calendar'">
        <p>
          This widget lets you add/delete events to each day.
        </p>
        <ul>
          <li>Add Event: Click on a date, enter event on top ('Enter Your Events'), and press 'Enter'.</li><br/>
          <li>Delete Event: Click the 'x' to the left of the event.</li>
        </ul>
      </Popover>
    );
  }

  render() {
    return (
      <div className="main_StockMarket text-center">
         <h2 className="pull-left">
            &nbsp;
            <i className="fa fa-university" aria-hidden="true"></i>
            &nbsp;
            Stock Market
          </h2>
          <span className="pull-right">
            <OverlayTrigger trigger="hover" placement="bottom" overlay={this.moreInfo()}>
              <i className="fa fa-info-circle moreInfoBtn" aria-hidden="true"></i>
            </OverlayTrigger>
          </span>
          <input
            className="stock-market-input text-center"
            type="text"
            placeholder="Enter Stock Symbol"
            ref={(input) => { this.stockSymbol = input; }}
            onKeyPress={this.getStockData}
          />
          <ul>
            {this.showData()}
          </ul>
      </div>
    );
  }
}

export default StockMarket;

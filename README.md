## Synopsis

A serverless web-app that allows users to look up cryptocurrencies and perform basic virtual trade manipulations (buy and sell coins).

## Live Demo

Link to App: [Velvet Crypto](http://velvet-crypto.herokuapp.com)

_Please wait for up to 15 seconds as the free Heroku server fires up for the app._

## Installation

$ git clone https://github.com/EugeCos/crypto-tracker.git <br />
$ cd PROJECT <br />
$ npm install

## Start & watch

$ npm start

## Simple build for production

$ npm run build

## API Reference

https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,LTCtsyms=USD <br />
for coin rates

https://cors-anywhere.herokuapp.com/https://www.cryptocompare.com/api/data/coinlist/ <br />
for coin full names and avatars

---

## Tools

- ReactJS - main library
- LESS - CSS preprocessing
- Webpack - watch and compile LESS files
- Axios - API calls
- Material UI - front-end framework
- Font Awesome - fonts

---

## Timeline

August 9 - August 16, 2018

## Contributors

- Eugene Costov // eugene.costov@gmail.com

## Licence

_Velvet-Crypto_ is available under MIT.

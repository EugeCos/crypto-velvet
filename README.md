## Synopsis

A full stack web-app that allows users to look up cryptocurrencies and perform basic virtual trade manipulations (buy and sell coins).

## Live Demo

Link to App: [Velvet Crypto](https://velvet-crypto.herokuapp.com)

_Please wait for up to 15 seconds as the free Heroku server fires up for the app._

## Installation

$ git clone https://github.com/EugeCos/crypto-velvet.git <br />
$ cd PROJECT <br />
$ npm client-install

## Start server and client & watch

$ npm run dev

## Simple build for production

$ npm run build

## API Reference

https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,LTCtsyms=USD <br />
for coin rates

https://min-api.cryptocompare.com/data/all/coinlist <br />
for coin full names and avatars

---

## Tools

- ReactJS - main library
- LESS - CSS preprocessing
- Webpack - watch and compile LESS files
- Axios - API calls
- Material UI - front-end framework
- Font Awesome - fonts
- MongoDB and Mongoose - data storage and serving
- Express - API serving
- Concurrently - run client and server simultaneously
- Passport - auth validation
- Bcrypt - password encryption
- JWT - data transfer
- Validator - data validation

---

## Timeline

August 9 to August 12, 2018 - initialized the project<br />
October 8 to October 21, 2018 - project development

## Contributors

- Eugene Costov // eugene.costov@gmail.com

## Licence

_Velvet-Crypto_ is available under MIT.

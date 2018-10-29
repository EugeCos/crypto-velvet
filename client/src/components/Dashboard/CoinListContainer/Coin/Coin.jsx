import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./Coin.less";

// ----------REACT-CSS-TRANSITION-GROUP-----------
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

// ---------MATERIAL-UI---------
import Dialog from "material-ui/Dialog";

// ----------COMPONENTS-----------
import CoinModal from "../../CoinModal/CoinModal";
import Spinner from "../../../Common/Spinner";

// --------REDUX---------
import { connect } from "react-redux";
import { deleteCoin } from "../../../../actions/tradeActions";

class Coin extends Component {
  constructor() {
    super();
    this.state = {
      dialogOpen: false,
      selectedCoin: {}
    };
  }

  handleOpen = coin => {
    this.setState({
      dialogOpen: true,
      selectedCoin: coin
    });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDeleteClick = (e, name) => {
    e.stopPropagation();
    this.props.deleteCoin(name);
  };

  render() {
    const { selectedCoin } = this.state;
    const { screenWidth, auth } = this.props;
    const { myCoins, currencyArray } = this.props.trade;
    const transitionOptions = {
      transitionName: "fade",
      transitionEnterTimeout: 400,
      transitionLeaveTimeout: 400
    };

    const myCoinsCopy = [...myCoins];

    const dialogStyle =
      screenWidth > 480
        ? {
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            color: "rgb(227, 214, 255)",
            fontFamily: "Varela Round, sans-serif",
            minHeight: "500px"
          }
        : {
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            color: "rgb(227, 214, 255)",
            fontFamily: "Varela Round, sans-serif",
            minHeight: "350px"
          };

    let coinJSX = myCoins.map(coin => {
      return (
        <div
          className="coin-wrapper"
          key={coin.name}
          onClick={() => this.handleOpen(coin)}
        >
          {coin.avatar ? (
            <img className="coin-icon" src={coin.avatar} alt="" />
          ) : (
            <Spinner />
          )}

          <div className="coin-data">
            <h3>$&nbsp;{coin.rateToUSD}</h3>
            <p>
              {coin.coinName}
              <span style={{ color: "#57606f" }}>&nbsp;({coin.name})</span>
            </p>
          </div>

          <div className="holder-coin">
            <img className="purple-coin" src="/img/purple_coin.png" alt="" />
            <p>{coin.holding.toFixed(2)}</p>
          </div>

          <div className="holder-amount">
            <h3>
              $&nbsp;{coin.totalValue.toLocaleString("en", {
                maximumFractionDigits: 2
              })}
            </h3>
          </div>

          <i
            className="fa fa-times"
            onClick={e => this.handleDeleteClick(e, coin.name)}
          />
        </div>
      );
    });

    return (
      <Fragment>
        {currencyArray.length ? (
          <ReactCSSTransitionGroup {...transitionOptions}>
            {coinJSX}
          </ReactCSSTransitionGroup>
        ) : (
          <h3 className="empty-list-message">
            {auth.isAuthenticated ? (
              <p>
                You don't have any coins.<br />Please lookup a coin.
              </p>
            ) : (
              <p>
                Oops, the list is empty.<br />Please lookup a coin.
              </p>
            )}
          </h3>
        )}
        <Dialog
          modal={false}
          paperClassName="dialog-style"
          bodyStyle={dialogStyle}
          autoDetectWindowHeight={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          <CoinModal
            screenWidth={screenWidth}
            coin={selectedCoin}
            handleClose={this.handleClose}
          />
        </Dialog>
      </Fragment>
    );
  }
}

Coin.propTypes = {
  screenWidth: PropTypes.number.isRequired,
  auth: PropTypes.object.isRequired,
  deleteCoin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  screenWidth: state.screenWidth.screenWidth,
  auth: state.auth,
  trade: state.trade
});

export default connect(
  mapStateToProps,
  { deleteCoin }
)(Coin);

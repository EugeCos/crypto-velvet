import React, { Component } from "react";
import PropTypes from "prop-types";
import "./AddCoin.less";

// ---------MATERIAL-UI---------
import Dialog from "material-ui/Dialog";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";

// ---------REDUX----------
import { connect } from "react-redux";
import { addCoin } from "../../../actions/tradeActions";

class AddCoin extends Component {
  constructor() {
    super();
    this.state = {
      dialogOpen: false,
      searchList: [],
      searchValue: "",
      selectedIndex: null,
      selectedCoin: null
    };
  }

  handleOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    this.setState({
      dialogOpen: false,
      searchList: [],
      searchValue: "",
      selectedIndex: null,
      selectedCoin: null
    });
  };

  handleChange = e => {
    this.setState(
      {
        searchValue: e.target.value
      },
      () => this.searchCoin()
    );
  };

  searchCoin() {
    const { allCoins } = this.props;
    const { searchValue } = this.state;
    let suggestions = [];
    if (searchValue.length > 0 && allCoins.length > 0) {
      allCoins.reduce((a, e, i) => {
        if (
          searchValue.toUpperCase() ===
          e.coinName.substr(0, searchValue.length).toUpperCase()
        ) {
          suggestions.push(e);

          // Limiting search length depending on screen width
          // if (screenWidth < 1024 && screenWidth > 481) {
          //   return suggestions.length < 5
          //     ? suggestions
          //     : (suggestions.length = 5);
          // } else if (screenWidth < 480) {
          //   return suggestions.length < 4
          //     ? suggestions
          //     : (suggestions.length = 4);
          // } else {
          //   return suggestions.length < 6
          //     ? suggestions
          //     : (suggestions.length = 6);
          // }
        }

        return suggestions;
      });
      allCoins.reduce((a, e, i) => {
        if (
          searchValue.toUpperCase() ===
          e.name.substr(0, searchValue.length).toUpperCase()
        ) {
          suggestions.push(e);

          // Limiting search length depending on screen width
          // if (screenWidth < 1024 && screenWidth > 481) {
          //   return suggestions.length < 5
          //     ? suggestions
          //     : (suggestions.length = 5);
          // } else if (screenWidth < 480) {
          //   return suggestions.length < 4
          //     ? suggestions
          //     : (suggestions.length = 4);
          // } else {
          //   return suggestions.length < 6
          //     ? suggestions
          //     : (suggestions.length = 6);
          // }
        }
        return suggestions;
      });

      suggestions = suggestions.filter(
        (coin, index, self) =>
          self.findIndex(t => t.name === coin.name) === index
      );
    }
    this.setState({ searchList: suggestions.sort().reverse() });
  }

  selectCoin = (index, coinCode) => {
    const { selectedIndex } = this.state;
    if (selectedIndex !== index) {
      this.setState({
        selectedIndex: index,
        selectedCoin: coinCode
      });
    } else {
      this.setState({
        selectedIndex: null,
        selectedCoin: null
      });
    }
  };

  handleClick = () => {
    this.props.addCoin(this.state.selectedCoin);
    this.setState({
      searchValue: "",
      searchList: [],
      selectedIndex: null,
      selectedCoin: null,
      dialogOpen: false
    });
  };

  render() {
    const { searchValue, searchList, selectedIndex, selectedCoin } = this.state;
    const { screenWidth, allCoins } = this.props;

    const titleStyle =
      screenWidth > 480
        ? {
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            color: "rgb(227, 214, 255)",
            fontFamily: "Varela Round, sans-serif",
            textAlign: "center"
          }
        : {
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            color: "rgb(227, 214, 255)",
            fontFamily: "Varela Round, sans-serif",
            textAlign: "center",
            fontSize: "95%"
          };

    const dialogStyle =
      screenWidth > 480
        ? {
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            color: "rgb(227, 214, 255)",
            fontFamily: "Varela Round, sans-serif",
            minHeight: "450px",
            maxHeight: "450px"
          }
        : {
            background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            color: "rgb(227, 214, 255)",
            fontFamily: "Varela Round, sans-serif",
            minHeight: "400px",
            maxHeight: "400px"
          };

    const buttonStyle =
      screenWidth > 480
        ? {
            position: "absolute",
            left: "50%"
          }
        : {
            position: "absolute",
            left: "43%"
          };

    let coinListJSX = searchList.map((coin, index) => {
      const className =
        selectedIndex === index ? "search-result selected" : "search-result";
      return (
        <div
          key={index}
          className={className}
          onClick={() => this.selectCoin(index, coin.name)}
        >
          <img src={coin.avatar} alt="" />
          <p className="coin-name">{coin.coinName}</p>
          <p className="coin-code">{coin.name}</p>
        </div>
      );
    });
    return (
      <span className="add-coin-container">
        <div className="custom-button" onClick={this.handleOpen}>
          <h4>+ Add Coin</h4>
        </div>

        <Dialog
          title="SEARCH FOR A COIN"
          modal={false}
          paperClassName="dialog-style"
          bodyStyle={dialogStyle}
          titleStyle={titleStyle}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          <form>
            <input
              type="text"
              placeholder="BTC, Litecoin, Ethereum etc."
              value={searchValue}
              onChange={this.handleChange}
            />
          </form>
          {searchList.length ? (
            <div className="coins-found-container">
              <p className="coins-found-text">
                Coins found: <span>{searchList.length}</span>
              </p>
              <p className="coins-found-text">
                Coins in the database: <span>{allCoins.length}</span>
              </p>
            </div>
          ) : null}
          <div className={searchList.length ? "search-result-container" : ""}>
            {coinListJSX}
          </div>
          <br />
          <FloatingActionButton
            backgroundColor={"#B53471"}
            mini={true}
            disabled={selectedCoin ? false : true}
            style={buttonStyle}
            onClick={() => this.handleClick()}
          >
            <ContentAdd />
          </FloatingActionButton>
        </Dialog>
      </span>
    );
  }
}

AddCoin.propType = {
  screenWidth: PropTypes.number.isRequired,
  allCoins: PropTypes.array.isRequired,
  addCoin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  screenWidth: state.screenWidth.screenWidth,
  allCoins: state.trade.allCoins
});

export default connect(
  mapStateToProps,
  { addCoin }
)(AddCoin);

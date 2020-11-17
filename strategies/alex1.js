var strat = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// VARIABLES
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var lastOp;
var lastPrice;
var lastSell;
var lastBuy;
var lastPeak;
var lastBottom;
// var percentage;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
strat.init = function() {
  // History
  this.requiredHistory = 21; // require X candles before giving advice

  // Indicators
  this.addTulipIndicator('ema05', 'ema', { optInTimePeriod: 5 });
  this.addTulipIndicator('ema10', 'ema', { optInTimePeriod: 10 });
  this.addTulipIndicator('ema21', 'ema', { optInTimePeriod: 21 });

  lastOp = null;
  lastPrice = null;
  lastSell = null;
  lastBuy = null;
  lastPeak = null;
  lastBottom = null;
  // percentage = null;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CHECK
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
strat.check = function(candle) {
  // console.log(candle.start.format('DD/MM/YYYY'));
  // this.advice('long');
  // this.advice('short');

  // Indicators
  const ema05 = this.tulipIndicators.ema05.result.result;
  const ema10 = this.tulipIndicators.ema10.result.result;
  const ema21 = this.tulipIndicators.ema21.result.result;

  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // MICHEL STYLE
  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  const price = candle.close;

  // Startup
  if (!lastSell) {
    lastSell = price;
    lastPeak = price;
    lastBottom = price;
    lastOp = 'sell';
    return;
  }

  // Updates
  if (price > lastPeak) lastPeak = price;
  if (price < lastBottom) lastBottom = price;
  // console.log(price);
  // console.log(lastPeak);
  // console.log(lastBottom);
  // console.log('----------');

  // Buy & sell logic
  const logicEMA = ema05 > ema10;
  const stopLoss = price < lastBuy * 0.95;
  // const stopProfit = price < lastPeak * 0.99;
  const stopProfit = price > lastBuy * 1.03;

  // if (price > lastBuy * 1.01 || price < lastBuy * 0.97) {
  if(stopLoss || stopProfit) {
    if (lastOp != 'sell') {
      this.advice('short'); //console.log('short');
      lastOp = 'sell';
      lastSell = price;
      lastPeak = price;
      lastBottom = price;
      return;
    }
  }

  if (price < lastPeak * 0.97) {
  // if (logicEMA) {
    if (lastOp != 'buy') {
      this.advice('long'); //console.log('long');
      lastOp = 'buy';
      lastBuy = price;
      lastPeak = price;
      lastBottom = price;
      return;
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // ONLY EMA
  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // if (ema05 > ema10 && ema10 > ema21) {
  //   this.advice('long');
  // } else {
  //   this.advice('short');
  // }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // WITH STOP
  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // if (ema10 > ema21) {
  //   this.advice({
  //     direction: 'long',
  //     trigger: {
  //       type: 'trailingStop',
  //       trailPercentage: 10
  //     }
  //   });
  // }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// EXPORT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
module.exports = strat;

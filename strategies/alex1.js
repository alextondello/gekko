var strat = {};

strat.init = function() {
  this.addTulipIndicator('ema10', 'ema', { optInTimePeriod: 10 });
  this.addTulipIndicator('ema21', 'ema', { optInTimePeriod: 21 });
  // this.addTulipIndicator('ema10', 'ema', { optInTimePeriod: 100 });
}

strat.check = function(candle) {
  // console.log(candle.start.format('DD/MM/YYYY'));
  // this.advice('long');
  // this.advice('short');

  const ema10 = this.tulipIndicators.ema10.result.result;
  const ema21 = this.tulipIndicators.ema21.result.result;
  // const ema100 = this.tulipIndicators.ema100.result.result;

  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // ONLY EMA
  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  if (ema10 > ema21) {
    this.advice('long');
  } else {
    this.advice('short');
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // WITH STOP
  // ~~~~~~~~~~~~~~~~~~~~~~~~~
  // if (ema10 > ema21) {
  //   this.advice({
  //     direction: 'long',
  //     trigger: {
  //       type: 'trailingStop',
  //       trailPercentage: 5
  //     }
  //   });
  // }
}

module.exports = strat;

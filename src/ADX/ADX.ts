import {Big} from 'big.js';
import {BigIndicatorSeries} from '../Indicator';
import {MovingAverage} from '../MA/MovingAverage';
import {HighLowClose} from '../util/HighLowClose';
import {MovingAverageTypes} from '../MA/MovingAverageTypes';
import {WSMA} from '../WSMA/WSMA';
import {DX} from '../DX/DX';

/**
 * Average Directional Index (ADX)
 * Type: Momentum, Trend (using +DI & -DI), Volatility
 *
 * The ADX was developed by **John Welles Wilder, Jr.**. It is a lagging indicator; that is, a
 * trend must have established itself before the ADX will generate a signal that a trend is under way.
 *
 * ADX will range between 0 and 100 which makes it an oscillator. It is a smoothed average of the Directional Movement
 * Index (DMI / DX).
 *
 * Generally, ADX readings below 20 indicate trend weakness, and readings above 40 indicate trend strength.
 * A strong trend is indicated by readings above 50. ADX values of 75-100 signal an extremely strong trend.
 *
 * If ADX increases, it means that volatility is increasing and indicating the beginning of a new trend.
 * If ADX decreases, it means that volatility is decreasing, and the current trend is slowing down and may even
 * reverse.
 * When +DI is above -DI, then there is more upward pressure than downward pressure in the market.
 *
 * @see https://www.investopedia.com/terms/a/adx.asp
 * @see https://www.youtube.com/watch?v=n2J1H3NeF70
 * @see https://learn.tradimo.com/technical-analysis-how-to-work-with-indicators/adx-determing-the-strength-of-price-movement
 * @see https://medium.com/codex/algorithmic-trading-with-average-directional-index-in-python-2b5a20ecf06a
 */
export class ADX extends BigIndicatorSeries {
  private readonly dx: DX;
  private readonly adx: MovingAverage;

  constructor(public readonly interval: number, SmoothingIndicator: MovingAverageTypes = WSMA) {
    super();
    this.dx = new DX(interval, SmoothingIndicator);
    this.adx = new SmoothingIndicator(this.interval);
  }

  get mdi(): Big | void {
    return this.dx.mdi;
  }

  get pdi(): Big | void {
    return this.dx.pdi;
  }

  update(candle: HighLowClose): Big | void {
    const result = this.dx.update(candle);
    if (result) {
      this.adx.update(result);
    }
    if (this.adx.isStable) {
      return this.setResult(this.adx.getResult());
    }
  }
}

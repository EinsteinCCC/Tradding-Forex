import Big, {BigSource} from 'big.js';
import {SMA} from '..';

export type DMAResult = {long: Big; short: Big};

export class DMA {
  public readonly long: SMA;
  public readonly short: SMA;

  constructor(short: number, long: number) {
    this.short = new SMA(short);
    this.long = new SMA(long);
  }

  update(_price: BigSource): void {
    const price = new Big(_price);

    this.short.update(price);
    this.long.update(price);
  }

  getResult(): DMAResult {
    return {
      long: this.long.getResult(),
      short: this.short.getResult(),
    };
  }
}

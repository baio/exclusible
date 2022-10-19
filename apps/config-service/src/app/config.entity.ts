import { ISpreadConfig } from '@exclusible/shared';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export const DEFAULT_ID = 1;

@Entity()
export class ConfigEntity {
  constructor(spreadConfig?: ISpreadConfig) {
    this.id = DEFAULT_ID;
    if (spreadConfig) {
      this.spreadBuyOffset = spreadConfig.buyOffset;
      this.spreadSellOffset = spreadConfig.sellOffset;
    }
  }

  @PrimaryColumn()
  id: number;

  @Column()
  spreadBuyOffset: number;

  @Column()
  spreadSellOffset: number;
}

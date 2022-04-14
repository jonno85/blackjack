import { Card } from './card.interface';

export interface Player {
  getName(): string;
  addCard(card: Card): any;
  get cards(): Card[];
  get score(): number;
  isDealer(): boolean;
  isBust(): boolean;
  isMin(): boolean;
}

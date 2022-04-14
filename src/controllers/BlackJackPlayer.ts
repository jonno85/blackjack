import { Card } from '@/interfaces/card.interface';
import { Player } from '@/interfaces/player.interface';

class BlackJackPlayer implements Player {
  private cardsInHands: Card[] = [];
  private point = 0;
  private name: string;
  private regularPlayer = true;

  constructor(playerName?: string) {
    this.name = playerName ?? 'unknownPlayer';
    this.regularPlayer = !(this.name === 'Dealer');
  }

  isDealer = (): boolean => {
    return this.regularPlayer;
  };

  getName(): string {
    return this.name;
  }

  addCard = (card: Card): boolean => {
    if (!this.isBust()) {
      this.cardsInHands.push(card);
      this._calculateScore();
      return true;
    }
    return false;
  };

  _calculateScore = () => {
    this.point = 0;
    this.cardsInHands.forEach(card => {
      let toBeAdded = 0;
      if (['J', 'K', 'Q'].includes(card.value)) {
        toBeAdded = 10;
      } else if (card.value === 'A') {
        toBeAdded = 11;
      } else {
        toBeAdded = parseInt(card.value);
      }

      this.point += toBeAdded;
    });
  };

  get cards(): Card[] {
    return this.cardsInHands;
  }

  get score(): number {
    return this.point;
  }

  isBust = (): boolean => this.point > 21;

  isMin = (): boolean => {
    if (this.regularPlayer) {
      return this.point >= 17;
    }
    return this.point >= 21;
  };
}

export default BlackJackPlayer;

import BlackJackPlayer from '@/controllers/BlackJackPlayer';
import { Card } from '@/interfaces/card.interface';
import { GameError } from '@/interfaces/error.interface';
import { Game } from '@/interfaces/game.interface';
import { Player } from '@/interfaces/player.interface';
import { mapResponse } from '@/models/mapper/response.mapper';

class BlackjackGameService implements Game {
  private dealerPlayer: BlackJackPlayer;
  private players: BlackJackPlayer[];
  private deck: Card[];
  private gameEnded: boolean;

  constructor(cards: Card[], dealerPlayer: BlackJackPlayer, players: BlackJackPlayer[]) {
    this.dealerPlayer = dealerPlayer;
    this.players = players;
    this.deck = cards;
    this.gameEnded = false;
  }

  get status(): string {
    return mapResponse(this.dealerPlayer, this.players, this.getWinner());
  }

  /**
   *
   * @returns the winner if all the players have played
   */
  getWinner = (): string => {
    if (this.checkAllPlayersDone()) {
      let maxScoreRegularPlayers = 0;
      let maxPlayerName: string;
      this.players.forEach(player => {
        if (!player.isBust() && player.score > maxScoreRegularPlayers) {
          maxScoreRegularPlayers = player.score;
          maxPlayerName = player.getName();
        }
      });
      if (this.dealerPlayer.isBust() || maxScoreRegularPlayers > this.dealerPlayer.score) {
        return maxPlayerName;
      }
      return this.dealerPlayer.getName();
    }
    return '';
  };

  /**
   * verifies if all regular players have played
   * @returns
   */
  checkAllRegularPlayersDone = (): boolean => {
    let done = 0;
    this.players.forEach(player => {
      if (player.isBust() || player.isMin()) {
        done += 1;
      }
    });
    return done === this.players.length;
  };

  /**
   * verifies if all players have played
   * @returns
   */
  checkAllPlayersDone = (): boolean => {
    return this.checkAllRegularPlayersDone() && (this.dealerPlayer.isBust() || this.dealerPlayer.isMin());
  };

  /**
   * Draw card(s) for the player
   * @param playerName regular player or DealerPlayer
   * @returns
   */
  play = (playerName: string): void => {
    if (this.gameEnded) {
      return;
    }
    const playersDone = this.checkAllRegularPlayersDone();

    let currentPlayer: Player;
    if (this.dealerPlayer.getName() === playerName) {
      currentPlayer = this.dealerPlayer;
      if (!playersDone) {
        throw new GameError('Users need to play first');
      }
    } else {
      const index = this.players.findIndex(player => player.getName() === playerName);
      if (index === -1) {
        throw new GameError('User not found');
      }
      currentPlayer = this.players[index];
    }

    try {
      if (currentPlayer.isBust()) {
        throw new GameError('Player is Bust');
      }

      if (currentPlayer.isMin()) {
        return;
      }
      let numberOfDraw = currentPlayer.cards.length === 0 ? 2 : 1;

      while (numberOfDraw-- > 0) {
        const nextCard = this.deck.pop();

        if (currentPlayer.isBust()) {
          throw new GameError('Player is Bust');
        }
        currentPlayer.addCard(nextCard);
      }
    } catch (e: any) {
      if (this.checkAllPlayersDone()) {
        this.gameEnded = true;
      }
      return;
    }

    if (this.checkAllPlayersDone()) {
      this.gameEnded = true;
    }
  };
}

export default BlackjackGameService;

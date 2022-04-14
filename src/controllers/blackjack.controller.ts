import BlackjackGameService from '@/services/blackjack.service';
import ShuffleService from '@/services/shuffle.service';
import { NextFunction, Request, Response } from 'express';
import BlackJackPlayer from './BlackJackPlayer';

class BlackJackController {
  public shuffleService = new ShuffleService();
  public blackjackGameService: BlackjackGameService;

  /**
   * returns the current game status
   */
  public status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (this.blackjackGameService) {
      res.status(200).send(this.blackjackGameService.status);
    }

    res.status(400).send('Game not initialized');
  };

  /**
   * instantiate a new game
   */
  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerString = (req.query.players as string) ?? 'player1';
      let players = [playerString];
      if (playerString.startsWith('[') && playerString.endsWith(']')) {
        players = playerString.replace('[', '').replace(']', '').split(',');
      }
      const shuffleUrl = req.query.url as string;

      const deck = await this.shuffleService.shuffle(shuffleUrl);

      this.blackjackGameService = new BlackjackGameService(
        deck,
        new BlackJackPlayer('Dealer'),
        players.map(player => new BlackJackPlayer(player)),
      );

      res.status(200).send(this.blackjackGameService.status);
    } catch (error) {
      next(error);
    }
  };

  /**
   * it plays the round for the player
   */
  public player = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerName = req.params.player as string;

      if (this.blackjackGameService) {
        this.blackjackGameService.play(playerName);
        res.status(200).send(this.blackjackGameService.status);
      }

      res.status(400).send('Game not initialized');
    } catch (error) {
      next(error);
    }
  };
}

export default BlackJackController;

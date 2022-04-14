import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import BlackJackController from '@/controllers/blackjack.controller';

class BlackjackRoute implements Routes {
  public path = '/';
  public router = Router();
  public blackjackController = new BlackJackController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}status`, this.blackjackController.status);
    this.router.get(`${this.path}`, this.blackjackController.index);
    this.router.get(`${this.path}player/:player?`, this.blackjackController.player);
  }
}

export default BlackjackRoute;

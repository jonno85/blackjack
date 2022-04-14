import { Card } from '@/interfaces/card.interface';
import { logger } from '@/utils/logger';
import axios from 'axios';

class ShuffleService {
  public async shuffle(url?: string): Promise<Card[]> {
    try {
      const shuffleResult = await axios(url ?? 'https://sandbox.getunleash.io/blackjack/shuffle');

      if (shuffleResult.status !== 200) {
        throw new Error('Service error');
      }

      return shuffleResult.data;
    } catch (e: any) {
      logger.error('Impossible to get shuffled deck');
      throw new Error('Impossible to get shuffled deck');
    }
  }
}

export default ShuffleService;

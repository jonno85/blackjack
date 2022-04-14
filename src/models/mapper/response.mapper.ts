import { Card } from '@/interfaces/card.interface';
import { Player } from '@/interfaces/player.interface';

export const mapCard = (cards: Card[]) => {
  if (cards.length === 0) {
    return '';
  }
  return cards.map(card => `${card.suit.toLocaleUpperCase().charAt(0)}${card.value}`);
};

export const mapResponse = <T extends Player>(dealerPlayer: T, players: T[], winner: string): string => {
  const isBurst = player => (player.isBust() ? 'Bust' : '');

  const playersOutput = players.map(player => `${player.getName()} | ${player.score} | ${mapCard(player.cards)} ${isBurst(player)}\n`);

  return `${winner ? 'Winner: ' + winner + '\n\n' : ''}${dealerPlayer.getName()} | ${dealerPlayer.score} | ${mapCard(dealerPlayer.cards)} ${isBurst(
    dealerPlayer,
  )}\n${playersOutput.join('')}`;
};

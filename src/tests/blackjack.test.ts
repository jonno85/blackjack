import request from 'supertest';
import App from '@/app';
import BlackjackRoute from '@routes/blackjack.route';
import nock from 'nock';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing BlackJack', () => {
  describe('When game is not initialized', () => {
    describe('When I hit /status endpoint', () => {
      it('response statusCode 400', async () => {
        const blackjackRoute = new BlackjackRoute();
        const app = new App([blackjackRoute]);

        const res = await request(app.getServer()).get('/status').expect(400);

        expect(res.text).toBe(`Game not initialized`);
      });
    });
    describe('When I hit /play endpoint', () => {
      it('response statusCode 400', async () => {
        const blackjackRoute = new BlackjackRoute();
        const app = new App([blackjackRoute]);

        const res = await request(app.getServer()).get('/player/player1').expect(400);

        expect(res.text).toBe(`Game not initialized`);
      });
    });
  });
  describe('When I hit /', () => {
    it('response statusCode 200 and game initialized', async () => {
      const blackjackRoute = new BlackjackRoute();
      const app = new App([blackjackRoute]);

      const res = await request(app.getServer()).get('/');
      expect(res.status).toBe(200);
      const text = 'Dealer | 0 |  \nplayer1 | 0 |  ';
      expect(res.text).toMatch(text);
    });
  });
  describe('When I hit /', () => {
    describe('When specify a player name', () => {
      it('response statusCode 200 and game initialized and specific player', async () => {
        const blackjackRoute = new BlackjackRoute();
        const app = new App([blackjackRoute]);

        const res = await request(app.getServer()).get('/?players=john');
        expect(res.status).toBe(200);
        const text = 'Dealer | 0 |  \njohn | 0 |  ';
        expect(res.text).toMatch(text);
      });
    });
    describe('When I let play the dealer first', () => {
      it('response statusCode 400 and game initialized and specific player', async () => {
        const blackjackRoute = new BlackjackRoute();
        const app = new App([blackjackRoute]);

        await request(app.getServer()).get('/?players=john');
        const res = await request(app.getServer()).get('/player/Dealer');
        expect(res.status).toBe(400);
        expect(res.text).toMatch('Users need to play first');
      });
    });

    describe('When I let play the player first', () => {
      it('response statusCode 200 and game initialized and specific player', async () => {
        const blackjackRoute = new BlackjackRoute();
        const app = new App([blackjackRoute]);

        nock('http://shuffle-deck')
          .get(`/`)
          .reply(200, `[{"suit":"CLUBS","value":"7"},{"suit":"HEARTS","value":"3"},{"suit":"DIAMONDS","value":"9"},{"suit":"DIAMONDS","value":"8"}]`);

        await request(app.getServer()).get('/?url=http://shuffle-deck&players=john');
        const res = await request(app.getServer()).get('/player/john');
        expect(res.status).toBe(200);
        const text = 'Dealer | 0 |  \njohn | 17 | D8,D9';
        expect(res.text).toMatch(text);
      });
    });
  });
});

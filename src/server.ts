import App from '@/app';
import validateEnv from '@utils/validateEnv';
import BlackjackRoute from './routes/blackjack.route';

validateEnv();

const app = new App([new BlackjackRoute()]);

app.listen();

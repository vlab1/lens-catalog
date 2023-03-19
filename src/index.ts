import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import AccountController from '@/resources/account/account.controller';
import LensesController from '@/resources/lenses/lenses.controller';

validateEnv();

const app = new App(
    [
        new AccountController(),
        new LensesController(),
    ],
    Number(process.env.PORT)
);

app.listen();

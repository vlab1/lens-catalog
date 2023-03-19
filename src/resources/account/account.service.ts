import AccountModel from '@/resources/account/account.model';
import token from '@/utils/token';
import Account from '@/resources/account/account.interface';
import { Schema } from 'mongoose';
import Props from '@/utils/types/props.type';
class AccountService {
    private account = AccountModel;

    public async register(
        email: string,
        password: string,
        name: string
    ): Promise<Account | Error> {
        try {
            const accountExists = await this.account.findOne({ email });
            if (accountExists) {
                throw new Error('Account already exists');
            }
            const account = await this.account.create({
                email,
                password,
                name,
            });

            return account;
        } catch (error) {
            throw new Error('Unable to create account');
        }
    }

    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const account = await this.account.findOne({ email });
            if (!account) {
                throw new Error(
                    'Unable to find account with that email address'
                );
            }
            if (await account.isValidPassword(password)) {
                const accesToken = token.createToken(account);
                return accesToken;
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error) {
            throw new Error('Unable to login account');
        }
    }

    public async delete(_id: Schema.Types.ObjectId): Promise<Account | Error> {
        try {
            const account = await this.account
                .findByIdAndDelete(_id)
                .select(['-password'])
                .exec();

            if (!account) {
                throw new Error('Unable to delete account with that data');
            }

            return account;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(props: Props): Promise<Account | Array<Account> | Error> {
        try {

            const accounts = await this.account
                .find(props)
                .select(['-password'])
                .exec();

            if (!accounts) {
                throw new Error('Unable to find accounts');
            }

            return accounts;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default AccountService;

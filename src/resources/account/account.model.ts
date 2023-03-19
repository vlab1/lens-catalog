import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import Account from '@/resources/account/account.interface';

const AccountSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },

    },
    { timestamps: true }
);

AccountSchema.pre<Account>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    if (this.password) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

AccountSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<Account>('Accounts', AccountSchema);

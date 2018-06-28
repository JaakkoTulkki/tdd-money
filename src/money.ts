export interface ExpressionMoney {
    reduce(bank: Bank, to: string): Money;
    plus(addend: ExpressionMoney): ExpressionMoney;
    times(multiplier: number): ExpressionMoney;
    equals(money: ExpressionMoney): boolean;
}

export class Bank {
    private rates: object = {};
    public reduce(source: ExpressionMoney, to: string): Money {
        return source.reduce(this, to);
    }

    public addRate(from: string, to: string, rate: number): void {
        const pair: Pair = new Pair(from, to);
        this.rates[pair.toString()] = rate;
    }

    public rate(from: string, to: string): number {
        if(from === to) {
            return 1;
        }
        const pair: Pair = new Pair(from, to);
        return this.rates[pair.toString()];
    }
}

export class Sum implements ExpressionMoney{
    public constructor(public augend: ExpressionMoney, public addend: ExpressionMoney) {}

    public reduce(bank: Bank, to: string): Money {
        const amount: number = this.augend.reduce(bank, to).amount + this.addend.reduce(bank, to).amount;
        return new Money(amount, to);
    }

    plus(addend: ExpressionMoney): ExpressionMoney {
        return new Sum(this, addend);
    }

    times(multiplier: number): ExpressionMoney {
        return new Sum(this.augend.times(multiplier), this.addend.times(multiplier));
    }

    equals(money: ExpressionMoney): boolean {
        throw new Error('Should not be implemented');
    }
}

class Pair {
    constructor(private from: string, private to: string) {}

    public equals(object: Object) {
        const pair: Pair = object as Pair;
        return this.from === pair.from && this.to === pair.to;
    }

    public toString(): string {
        return `${this.from}-${this.to}`;
    }
}

export class Money implements ExpressionMoney{
    public constructor(public amount: number, protected _currency: string) {
    }

    public currency(): string {
        return this._currency;
    };

    public equals(object: any) {
        const money: Money = object as Money;
        return this.amount === money.amount && this.currency() === money.currency();
    }

    static dollar(amount: number): Money {
        return new Money(amount, 'USD');
    }

    static franc(amount: number): Money {
        return new Money(amount, 'CHF');
    }

    public plus(addend: ExpressionMoney): ExpressionMoney {
        return new Sum(this, addend);
    }

    public reduce(bank: Bank, to: string) {
        const rate: number = bank.rate(this.currency(), to);
        return new Money(this.amount / rate, this.currency());
    }

    times(multiplier: number): ExpressionMoney {
        return new Money(this.amount * multiplier, this.currency());
    }
}

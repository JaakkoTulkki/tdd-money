import {Bank, ExpressionMoney, Money, Sum} from "./money";

describe('Money', function () {
    it('should multiply', function () {
        const five: Money = Money.dollar(5);

        let product: ExpressionMoney = five.times(2);
        expect(product.equals(Money.dollar(10))).toBeTruthy();

        product = five.times(3);
        expect(product.equals(Money.dollar(15))).toBeTruthy();
    });

    it('should equal', function () {
        const five: Money = Money.dollar(5);

        expect(five.equals(Money.dollar(5))).toBeTruthy();
        expect(five.equals(Money.dollar(6))).not.toBeTruthy();
    });
});

describe('Dollars and Francs', function () {
    it('should not equal', function () {
        const fiveDollars = Money.dollar(5);
        const fiveFrancs = Money.franc(5);
        expect(fiveDollars.equals(fiveFrancs)).not.toBeTruthy();
    });
});

describe('Currency', function () {
    it('should return correct currencies', function () {
        expect(Money.dollar(1).currency()).toEqual('USD');
        expect(Money.franc(1).currency()).toEqual('CHF');
    });
});

describe('Addition', function () {
    it('should add dollars', function () {
        const five: Money = Money.dollar(5);
        const summed: ExpressionMoney = five.plus(five);

        const bank: Bank = new Bank();

        const reduced: Money = bank.reduce(summed, 'USD');
        expect(reduced).toEqual(Money.dollar(10));
    });

    it('should testReduceSum', function () {
        const sum: ExpressionMoney = new Sum(Money.dollar(3), Money.dollar(4));
        const bank: Bank = new Bank();
        const result: Money = bank.reduce(sum, 'USD');
        expect(result).toEqual(Money.dollar(7));
    });

    it('should testReduceMoney', function () {
        const bank: Bank = new Bank();
        const result: Money = bank.reduce(Money.dollar(1), 'USD');
        expect(result).toEqual(Money.dollar(1));
    });

    it('should plus returns sum', function () {
        const five: Money = Money.dollar(5);
        const result: ExpressionMoney = five.plus(five);
        const sum: Sum = result as Sum;
        expect(sum.augend).toEqual(five);
        expect(sum.addend).toEqual(five);
    });

    it('should test identity', function () {
        expect(new Bank().rate('USD', 'USD')).toEqual(1);
    });
});

describe('Different currencies', function () {
    it('should reduce and equal to dollars', function () {
        const bank: Bank = new Bank();
        bank.addRate('CHF', 'USD', 2);
        const result: Money = bank.reduce(Money.franc(2), 'USD');
        expect(result.equals(Money.dollar(1)));
    });

    it('should add up', () => {
        const fiveBucks: ExpressionMoney = Money.dollar(5);
        const tenFrancs: ExpressionMoney = Money.franc(10);
        const bank: Bank = new Bank();
        bank.addRate('CHF', 'USD', 2);

        const result: Money = bank.reduce(fiveBucks.plus(tenFrancs), 'USD');
        expect(result).toEqual(Money.dollar(10));
    });

    it('should add sum plus money', () => {
        const fiveBucks: ExpressionMoney = Money.dollar(5);
        const tenFrancs: ExpressionMoney = Money.franc(10);
        const bank: Bank = new Bank();
        bank.addRate('CHF', 'USD', 2);

        const sum: ExpressionMoney = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);
        const result: Money = bank.reduce(sum, 'USD');
        expect(result).toEqual(Money.dollar(15));
    });

    it('should sum', () => {
         const fiveBucks: ExpressionMoney = Money.dollar(5);
        const tenFrancs: ExpressionMoney = Money.franc(10);
        const bank: Bank = new Bank();
        bank.addRate('CHF', 'USD', 2);

        const sum: ExpressionMoney = new Sum(fiveBucks, tenFrancs).times(2);
        const result: Money = bank.reduce(sum, 'USD');
        expect(result).toEqual(Money.dollar(20));
    });
});

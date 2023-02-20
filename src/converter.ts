const data = [
    {"ccy":"EUR","base_ccy":"UAH","buy":"40.90","sale":"41.90"},
    {"ccy":"USD","base_ccy":"UAH","buy":"27.50","sale":"27.70"},
    {"ccy":"BTC","base_ccy":"USD","buy":"11500","sale":"11700"}
];

export const findConversionRate = (
    rates: typeof data,
    fromCurrency: string,
    toCurrency: string
): number => {
    const directRate = rates.find(rate => rate.ccy === fromCurrency && rate.base_ccy === toCurrency);
    if (directRate) {
        return Number(directRate.sale);
    }

    const reverseRate = rates.find(rate => rate.ccy === toCurrency && rate.base_ccy === fromCurrency);
    if (reverseRate) {
        return 1 / Number(reverseRate.buy);
    }

    const intermediateCurrency = rates.find((rate) => rate.ccy === fromCurrency)?.base_ccy;
    if (!intermediateCurrency) {
        return 0;
    }

    const intermediateRate = findConversionRate(rates, intermediateCurrency, toCurrency);
    if (!intermediateRate) {
        return 0;
    }

    const directRateToIntermediate = rates.find(rate => rate.ccy === fromCurrency && rate.base_ccy === intermediateCurrency);
    if (!directRateToIntermediate) {
        return 0;
    }

    return Number(directRateToIntermediate.sale) * intermediateRate;
};
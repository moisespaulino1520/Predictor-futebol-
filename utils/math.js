module.exports = {
    calculateProbability: (lambda, threshold) => {
        const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
        const poisson = (k, l) => (Math.pow(Math.E, -l) * Math.pow(l, k)) / factorial(k);
        let probUnderOrEqual = 0;
        for (let i = 0; i <= threshold; i++) {
            probUnderOrEqual += poisson(i, lambda);
        }
        return ((1 - probUnderOrEqual) * 100).toFixed(2);
    }
};

// Functions
// https://stackoverflow.com/a/57718593
const abbreviateNumber = (number, digits = 2) => {
    const SI_SYMBOLS = "pnμm kM";
    const BASE0_OFFSET = SI_SYMBOLS.indexOf(' ');
    let expK = Math.floor(Math.log10(Math.abs(number)) / 3);
    let scaled = number / Math.pow(1000, expK);

    if (Math.abs(scaled.toFixed(digits)) >= 1000) { // Check for rounding to next exponent
        scaled /= 1000;
        expK += 1;
    }

    if (expK + BASE0_OFFSET >= SI_SYMBOLS.length) { // Bound check
        expK = SI_SYMBOLS.length - 1 - BASE0_OFFSET;
        scaled = number / Math.pow(1000, expK);
    }
    else if (expK + BASE0_OFFSET < 0) return 0;  // Too small

    return (
        getNumberWithThousandSeparator(
            +scaled
                .toFixed(digits)
                .replace(/(\.|(\..*?))0+$/, '$2')
        ) +
        SI_SYMBOLS[expK + BASE0_OFFSET]
            .trim()
    );
}

const getNumberWithThousandSeparator = number => {
    return number.toLocaleString('de-DE');
}

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const clamp = ({ value, min, max }) => {
    return (
        value > max ?
            max :
            value < min ?
                min :
                value
    );
}

const interpolate = (x, z) => {
    return x + z
}

// Exports
export {
    abbreviateNumber as getNumberInSI,
    getNumberWithThousandSeparator as getFormatNumber,
    getRandomIntInclusive as getRandomNumber,
    clamp,
    interpolate
};
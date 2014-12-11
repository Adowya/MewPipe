function isInt(value) {
    if (!value)
        return;

    return !isNaN(value) &&
            parseInt(Number(value)) === value &&
            !isNaN(parseInt(value, 10));
}

function isFloat(value) {

    if (!value)
        return;

    return !isNaN(value) &&
            value.toString().indexOf('.') !== -1 ||
            value.toString().indexOf(',') !== -1 ||
            value % 1 === 0;
}

String.prototype.startsWith = function (needle)
{
    return(this.indexOf(needle) == 0);
};

function lpad(str, padString, length)
{
    while (str.length < length)
    {
        str = padString + str;

    }
    return str;
}
;
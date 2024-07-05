// utils.js
export const formatToNepaliDigits = (number) => {
    const digits = {
        '0': '०',
        '1': '१',
        '2': '२',
        '3': '३',
        '4': '४',
        '5': '५',
        '6': '६',
        '7': '७',
        '8': '८',
        '9': '९',
        '.': '.'
    };

    return number.toString().replace(/[0-9.]/g, (match) => digits[match]);
};

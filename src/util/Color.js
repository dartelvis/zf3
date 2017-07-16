

var Color = {
    getContrastYiq: function(hexcolor) {
        hexcolor = hexcolor.replace(/^#/, "");
        var r = parseInt(hexcolor.substr(0,2), 16),
            g = parseInt(hexcolor.substr(2,2), 16),
            b = parseInt(hexcolor.substr(4,2), 16),
            yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }
}

export default Color;

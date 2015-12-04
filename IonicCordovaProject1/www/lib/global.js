
var colorHover = "#394665";
var comilla = "'";
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthNames2 = [];
monthNames2["Jan"] = "01";
monthNames2["Feb"] = "02";
monthNames2["Mar"] = "03";
monthNames2["Apr"] = "04";
monthNames2["May"] = "05";
monthNames2["Jun"] = "06";
monthNames2["Jul"] = "07";
monthNames2["Aug"] = "08";
monthNames2["Sep"] = "09";
monthNames2["Oct"] = "10";
monthNames2["Nov"] = "11";
monthNames2["Dec"] = "12";

function bloquearTecla(event) {
    /* Bloquear ctr+u codigo fuente e inspector de elementos ctr+shift+i */
    /* return en la llama de la funcion para q devuelva el false ej "return bloquearTecla(event)" */
    /* no colocar alert ej: "alert("Bloqueado por Seguridad");" ya que firefox se salta la seguridad */

    if ((event.ctrlKey == true && event.keyCode == 85) || (event.ctrlKey == true && event.shiftKey == true && event.keyCode == 73)) {
        //alert("Bloqueado por Seguridad"); 
        return false;
    }
    //console.log(event.ctrlKey.toString() + " " + event.keyCode.toString()); 
}

function normalize(str) {
    str = str.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
    return str.replace(/[^a-zA-Z 0-9.]+/g, ' ');
}

function quitarAcentos(str) {
    for (var i = 0; i < str.length; i++) {
        //Sustituye "Ã¡ Ã© Ã­ Ã³ Ãº" 
        if (str.charAt(i) == "Ã¡") str = str.replace(/Ã¡/, "a");
        if (str.charAt(i) == "Ã©") str = str.replace(/Ã©/, "e");
        if (str.charAt(i) == "Ã­") str = str.replace(/Ã­/, "i");
        if (str.charAt(i) == "Ã³") str = str.replace(/Ã³/, "o");
        if (str.charAt(i) == "Ãº") str = str.replace(/Ãº/, "u");
        if (str.charAt(i) == "Ã") str = str.replace(/Ã/, "A");
        if (str.charAt(i) == "Ã‰") str = str.replace(/Ã‰/, "E");
        if (str.charAt(i) == "Ã") str = str.replace(/Ã/, "I");
        if (str.charAt(i) == "Ã“") str = str.replace(/Ã“/, "O");
        if (str.charAt(i) == "Ãš") str = str.replace(/Ãš/, "U");
    } //fin for 
    return str;
}
function agregarLinksEnCadena(data) {
    //Add link to all http:// links within tweets
    data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function (url) {
        return '<a target="_blank" href="' + url + '" >' + url + '</a>';
    });

    //Add link to @usernames used within tweets
    data = data.replace(/\B@([_a-z0-9]+)/ig, function (reply) {
        return '<a target="_blank" href="http://twitter.com/' + reply.substring(1) + '" style="font-weight:lighter;" target="_blank">' + reply.charAt(0) + reply.substring(1) + '</a>';
    });
    //Add link to #hastags used within tweets
    data = data.replace(/\B#([_a-z0-9]+)/ig, function (reply) {
        return '<a target="_blank" href="https://twitter.com/search?q=' + reply.substring(1) + '" style="font-weight:lighter;" target="_blank">' + reply.charAt(0) + reply.substring(1) + '</a>';
    });
    return data;
}

function tiempoRelativo(time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    var shortdate = time_value.substr(4, 2) + " " + time_value.substr(0, 3);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    if (delta < 60) {
        return '1m';
    } else if (delta < 120) {
        return '1m';
    } else if (delta < (60 * 60)) {
        return (parseInt(delta / 60)).toString() + 'm';
    } else if (delta < (120 * 60)) {
        return '1h';
    } else if (delta < (24 * 60 * 60)) {
        return (parseInt(delta / 3600)).toString() + 'h';
    } else if (delta < (48 * 60 * 60)) {
        //return '1 day';
        return shortdate;
    } else {
        return shortdate;
    }
}

function restaFechas(f1, f2) {
    /* DD/MM/YYYY */
    var aFecha1 = f1.split('-');
    var aFecha2 = f2.split('-');
    var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
}

function utf8_decode(str_data) {
    //  discuss at: http://phpjs.org/functions/utf8_decode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    //    input by: Aman Gupta
    //    input by: Brett Zamir (http://brett-zamir.me)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Norman "zEh" Fuchs
    // bugfixed by: hitwork
    // bugfixed by: Onno Marsman
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: kirilloid
    //   example 1: utf8_decode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    var tmp_arr = [],
      i = 0,
      ac = 0,
      c1 = 0,
      c2 = 0,
      c3 = 0,
      c4 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 <= 223) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else if (c1 <= 239) {
            // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            c4 = str_data.charCodeAt(i + 3);
            c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
            c1 -= 0x10000;
            tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
            i += 4;
        }
    }

    return tmp_arr.join('');
}


function utf8_encode(argString) {
    //  discuss at: http://phpjs.org/functions/utf8_encode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: sowberry
    // improved by: Jack
    // improved by: Yves Sucaet
    // improved by: kirilloid
    // bugfixed by: Onno Marsman
    // bugfixed by: Onno Marsman
    // bugfixed by: Ulrich
    // bugfixed by: Rafal Kukawski
    // bugfixed by: kirilloid
    //   example 1: utf8_encode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
      start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
              (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
              (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
              (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}
Number.prototype.format = function(n, x, s, c) {
    n = n == undefined ? 2 : n;
    x = x == undefined ? 3 : x;
    s = s == undefined ? '.' : s;
    c = c == undefined ? ',' : c;
    
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
    
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


/*!
 * jquery.base64.js 0.1 - https://github.com/yckart/jquery.base64.js
 * Makes Base64 en & -decoding simpler as it is.
 *
 * Based upon: https://gist.github.com/Yaffle/1284012
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/10
 **/
;(function($) {

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a256 = '',
        r64 = [256],
        r256 = [256],
        i = 0;

    var UTF8 = {

        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        encode: function(strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            })
            .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });
            return strUtf;
        },

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        decode: function(strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
            function(c) { // (note parentheses for precence)
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            })
            .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
            function(c) { // (note parentheses for precence)
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            });
            return strUni;
        }
    };

    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }

    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;

        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;

            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;

            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }

    var Plugin = $.base64 = function(dir, input, encode) {
            return input ? Plugin[dir](input, encode) : dir ? null : this;
        };

    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
        plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    };

    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
}(jQuery));

jQuery.readCookie = function (name) 
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) 
    {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};

jQuery.deleteCookie = function (name) 
{
    jQuery.createCookie(name,"",-1);
};

jQuery.createCookie = function (name,value,time) 
{
    if (time) 
    {
        var date = new Date();
        date.setTime(date.getTime()+(time*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
};

(function($){
    $.getDateNow = function()
    {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        return dd+'/'+mm+'/'+yyyy;
    };
    
    $.numberToText = function($input) {
        if ($input == 0) {
            return 'Không';
        }

        /* Tên các nhóm */
        var $arGrp = [" trăm", " triệu", " nghìn", " tỷ"];

        /* Tên các chữ số */
        var $arNum = [" không", " một", " hai", " ba", " bốn", " năm", " sáu", " bảy", " tám", " chín",
            " mười", " mươi", " mốt", " linh", " tư", " lăm"];

        /* chuỗi chuẩn hoá */
        var $chuoiChuan = $input;

        /* dấu */
        var $dau = "";
        if ($chuoiChuan < 0) {
            $chuoiChuan = $chuoiChuan * -1;
            $dau = " âm";
        }
        if ($chuoiChuan > 9007199254740992) {
            return "Số quá lớn!";
        }
        $chuoiChuan = $chuoiChuan.toString();

        // chuẩn hoá thành chuỗi gồm các nhóm 9 số: 123 -> 000000123
        // ta đọc từng chuỗi 9 số rồi ghép lại
        $chuoiChuan = Array(10 - ($chuoiChuan.length % 9)).join("0") + $chuoiChuan;

        //thứ tự nhóm 3 số (trong từng nhóm 9 số)
        var $n03 = 1;
        // kết quả đọc nhóm 3 số
        var $s123 = "";
        //chuỗi kết quả
        var $dInt = "";
        var $lenChuoiChuan = $chuoiChuan.length;
        var $s1 = "";
        var $s2 = "";
        var $s3 = "";
        var $sNhom = "";
        var $n1;
        var $n2;
        var $n3;
        //duyệt từng nhóm 3 số
        for (var $nId = 0; $nId < $lenChuoiChuan; $nId += 3) {
            $s1 = "";
            $s2 = "";
            $s3 = "";
            $sNhom = "";
            //nếu nhóm này là 3 số 0
            if ($chuoiChuan.substr($nId, 3) === "000") {
                // nhóm 3 số này sẽ không được đọc
                $s123 = "";
                // nếu đã có kết quả đọc và đây là nhóm thứ 3, đang ở vị trí hơn 9 chữ số -> tỉ 
                if ($dInt !== "" && $n03 === 3 && $chuoiChuan.length - $nId > 9) {
                    $dInt = $dInt + $arGrp[3];
                }
            } else {
                $n1 = $chuoiChuan.substr($nId, 1);
                $n2 = $chuoiChuan.substr($nId + 1, 1);
                $n3 = $chuoiChuan.substr($nId + 2, 1);
                if ($n1 == 0 && $dInt !== "") {
                    $s1 = $arNum[0] + $arGrp[0];
                }
                if ($n1 > 0) {
                    $s1 = $arNum[$n1] + $arGrp[0];
                }
                if ($n2 == 0 && ($s1 == "" || $n3 == 0)) {
                    $s2 = "";
                }
                if ($n2 == 0 && $s1 != "" && $n3 > 0) {
                    $s2 = $arNum[13];
                }
                if ($n2 == 1) {
                    $s2 = $arNum[10];
                }
                if ($n2 > 1) {
                    $s2 = $arNum[$n2] + $arNum[11];
                }
                if ($n3 == 1 && $n2 <= 1) {
                    $s3 = $arNum[1];
                }
                if ($n3 == 1 && $n2 > 1) {
                    $s3 = $arNum[12];
                }
                if ($n3 == 5 && $n2 == 0) {
                    $s3 = $arNum[5];
                }
                if ($n3 == 5 && $n2 != 0) {
                    $s3 = $arNum[15];
                }
                if ($s3 == "" && $n3 > 0) {
                    $s3 = $arNum[$n3];
                }
                $s123 = $s1 + $s2 + $s3;
                if ($n03 == 3 && ($dInt !== "" || $s123 !== "") && $chuoiChuan.length - $nId > 9) {
                    $sNhom = $arGrp[3];
                }
                if ($sNhom == "" && $n03 < 3) {
                    $sNhom = $arGrp[$n03];
                }
                $s123 = $s123 + $sNhom;
                $dInt = $dInt + $s123;
            }
            if ($n03 == 3) {
                $n03 = 1;
            } else {
                $n03 = $n03 + 1;
            }
        }
        if ($dInt !== "") {
            $dInt = $dau + $dInt;
            $dInt = $dInt.substr(1, 1).toUpperCase() + $dInt.substr(2);
        }
        return $dInt;
    };

    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var F = function(x, y, z) {
        return (x & y) | ((~ x) & z);
    };

    var G = function(x, y, z) {
        return (x & z) | (y & (~ z));
    };

    var H = function(x, y, z) {
        return (x ^ y ^ z);
    };

    var I = function(x, y, z) {
        return (y ^ (x | (~ z)));
    };

    var FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWordsTempOne = lMessageLength + 8;
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function(lValue) {
        var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var uTF8Encode = function(string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    $.extend({
        md5: function(string) {
                 var x = Array();
                 var k, AA, BB, CC, DD, a, b, c, d;
                 var S11=7, S12=12, S13=17, S14=22;
                 var S21=5, S22=9 , S23=14, S24=20;
                 var S31=4, S32=11, S33=16, S34=23;
                 var S41=6, S42=10, S43=15, S44=21;
                 string = uTF8Encode(string);
                 x = convertToWordArray(string);
                 a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
                 for (k = 0; k < x.length; k += 16) {
                     AA = a; BB = b; CC = c; DD = d;
                     a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
                     d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
                     c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
                     b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
                     a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
                     d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
                     c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
                     b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
                     a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
                     d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
                     c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
                     b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
                     a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
                     d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
                     c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
                     b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
                     a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
                     d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
                     c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
                     b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
                     a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
                     d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
                     c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
                     b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
                     a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
                     d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
                     c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
                     b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
                     a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
                     d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
                     c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
                     b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
                     a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
                     d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
                     c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
                     b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
                     a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
                     d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
                     c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
                     b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
                     a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
                     d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
                     c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
                     b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
                     a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
                     d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
                     c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
                     b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
                     a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
                     d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
                     c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
                     b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
                     a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
                     d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
                     c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
                     b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
                     a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
                     d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
                     c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
                     b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
                     a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
                     d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
                     c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
                     b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
                     a = addUnsigned(a, AA);
                     b = addUnsigned(b, BB);
                     c = addUnsigned(c, CC);
                     d = addUnsigned(d, DD);
                 }
                 var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                 return tempValue.toLowerCase();
             }
    });
})(jQuery);

$(function() {
    $(document).ajaxStart(function(){
        //$('body').css('cursor', 'wait');
        $('#container').mask();
        $('#imgAjaxLoading').show();
    });
    
    $(document).ajaxComplete(function(){
        //$('body').css('cursor', 'default');
        $('#container').unmask();
        $('#imgAjaxLoading').hide();
    });
    
    $(document).ajaxError(function(){
        $('#container').unmask();
        $('#imgAjaxLoading').hide();
    });
    
    $.ajaxSetup({
        type : 'post',
        error: function(jqXHR, exception) {
            $('body').unmask();
            if(this.type.toLowerCase() === "post")
            {
                if (this.errorText) alert(this.errorText);
                else if (jqXHR.status === 0) {
                    //alert('CĂ³ lá»—i: KhĂ´ng káº¿t ná»‘i Ä‘Æ°á»£c Internet.');
                } else if (jqXHR.status === 404) {
                    //alert('CĂ³ lá»—i: Requested page not found. [404]');
                } else if (jqXHR.status === 500) {
                    //alert('CĂ³ lá»—i: Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    //alert('CĂ³ lá»—i: Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    //alert('CĂ³ lá»—i: Time out error.');
                } else if (exception === 'abort') {
                    //alert('CĂ³ lá»—i: Ajax request aborted.');
                } else {
                    //alert('CĂ³ lá»—i: Uncaught Error.\n' + jqXHR.responseText);
                }  
            }
        }
    });
});

(function($){
	
    $.fn.mask = function(label, delay){
        $(this).each(function() {
            if(delay !== undefined && delay > 0) {
            var element = $(this);
            element.data("_mask_timeout", setTimeout(function() { $.maskElement(element, label);}, delay));
            } else {
                    $.maskElement($(this), label);
            }
        });
    };

    /**
     * Removes mask from the element(s). Accepts both single and multiple selectors.
     */
    $.fn.unmask = function(){
            $(this).each(function() {
                    $.unmaskElement($(this));
            });
    };

    /**
     * Checks if a single element is masked. Returns false if mask is delayed or not displayed. 
     */
    $.fn.isMasked = function(){
            return this.hasClass("masked");
    };

    $.maskElement = function(element, label){

            //if this element has delayed mask scheduled then remove it and display the new one
            if (element.data("_mask_timeout") !== undefined) {
                    clearTimeout(element.data("_mask_timeout"));
                    element.removeData("_mask_timeout");
            }

            if(element.isMasked()) {
                    $.unmaskElement(element);
            }

            if(element.css("position") === "static") {
                    element.addClass("masked-relative");
            }

            element.addClass("masked");

            var maskDiv = $('<div class="loadmask"></div>');

            //auto height fix for IE
            if(navigator.userAgent.toLowerCase().indexOf("msie") > -1){
                    maskDiv.height(element.height() + parseInt(element.css("padding-top")) + parseInt(element.css("padding-bottom")));
                    maskDiv.width(element.width() + parseInt(element.css("padding-left")) + parseInt(element.css("padding-right")));
            }

            //fix for z-index bug with selects in IE6
            if(navigator.userAgent.toLowerCase().indexOf("msie 6") > -1){
                    element.find("select").addClass("masked-hidden");
            }

            element.append(maskDiv);

            if(label !== undefined) {
                    var maskMsgDiv = $('<div class="loadmask-msg" style="display:none;"></div>');
                    maskMsgDiv.append('<div>' + label + '</div>');
                    element.append(maskMsgDiv);

                    //calculate center position
                    maskMsgDiv.css("top", Math.round(element.height() / 2 - (maskMsgDiv.height() - parseInt(maskMsgDiv.css("padding-top")) - parseInt(maskMsgDiv.css("padding-bottom"))) / 2)+"px");
                    maskMsgDiv.css("left", Math.round(element.width() / 2 - (maskMsgDiv.width() - parseInt(maskMsgDiv.css("padding-left")) - parseInt(maskMsgDiv.css("padding-right"))) / 2)+"px");

                    maskMsgDiv.show();
            }

    };

    $.unmaskElement = function(element){
            //if this element has delayed mask scheduled then remove it
            if (element.data("_mask_timeout") !== undefined) {
                    clearTimeout(element.data("_mask_timeout"));
                    element.removeData("_mask_timeout");
            }

            element.find(".loadmask-msg,.loadmask").remove();
            element.removeClass("masked");
            element.removeClass("masked-relative");
            element.find("select").removeClass("masked-hidden");
    };
 
})(jQuery);


$.fn.showTitle = function(title, s) {
    var dv = $('#dvShowTitle');
    if (dv.length === 0)
    {
            dv = $('<div id="dvShowTitle" class="dvShowTitle"><div style="float:left;" id="mess"></div><div id="close" style="float:right;" title="ÄĂ³ng" class="ui-icon ui-icon-close"></div></div>');
            $('body').append(dv);
    }

    dv.find("#mess").html(title);
    if (s === 1){
        dv.css('top', $(this).offset().top - dv.height() - 3);
        dv.css('left', $(this).offset().left);
    }
    else
    if (s === 2){
        dv.css('top', $(this).offset().top + $(this).height() + 3);
        dv.css('left', $(this).offset().left);
    }
    else
    if (s === 3){
        dv.css('top', $(this).offset().top - dv.height() + 3);
        dv.css('left', $(this).offset().left + $(this).width() - dv.width());
    }
    else
    {
        dv.css('top', $(this).offset().top - dv.height() - 3);
        dv.css('left', $(this).offset().left);
        //dv.css('top', $(this).offset().top);
        //dv.css('left', $(this).offset().left + $(this).width() + 5);
    }
    dv.css('z-index', 10000000);
    dv.show();

    $(this).keypress(function(){
            $('#dvShowTitle').hide();
    });

    $(this).blur(function(){
            $('#dvShowTitle').hide();
    });

    dv.find("#close").click(function(){
            $('#dvShowTitle').hide();
    });
};

jQuery.hideTitle = function(title) {
	$('#dvShowTitle').hide();
};

jQuery.getCurrentPosition = function(input, div) {
    if (navigator.geolocation)
    {
        return navigator.geolocation.getCurrentPosition(function(position) {
            $(input).val(position.coords.latitude + ',' + position.coords.longitude);
            //$(div).html("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
            //https://www.google.com/maps/place//@19.7853608,105.7771389,17z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0
        });
    }
    else
    {  
        return false;
    }
};

jQuery.getCurrentPosition2 = function(fn) {
    if (navigator.geolocation)
    {
        return navigator.geolocation.getCurrentPosition(function(position) {
            fn(position.coords.latitude + ',' + position.coords.longitude);
        });
    }
    else
    {  
        return false;
    }
};
    
jQuery.getEditorHTML = function (name) 
{
    var fck = $("[name='" + name + "']");
    
    fck.val(FCKeditorAPI.GetInstance(fck.attr("id")).GetHTML());
    
    var a = fck.val();
    
    if (a === "<br />") a = "";
    
    if (a.substring(a.length - 6) === "<br />") a = a.substring(0, a.length - 6);
    
    return a;
};

jQuery.setEditorHTML = function (name, v) 
{
    var fck = $("[name='" + name + "']");
    FCKeditorAPI.GetInstance(fck.attr("id")).SetHTML(v);
};

jQuery.getEditor = function (name) 
{
    var fck = $("[name='" + name + "']");
    fck.val(FCKeditorAPI.GetInstance(fck.attr("id")).GetHTML());
    return FCKeditorAPI.GetInstance(fck.attr("id"));
};

(function($){
	
	/**
	 * Displays loading mask over selected element(s). Accepts both single and multiple selectors.
	 *
	 * @param label Text message that will be displayed on top of the mask besides a spinner (optional). 
	 * 				If not provided only mask will be displayed without a label or a spinner.  	
	 * @param delay Delay in milliseconds before element is masked (optional). If unmask() is called 
	 *              before the delay times out, no mask is displayed. This can be used to prevent unnecessary 
	 *              mask display for quick processes.   	
	 */
	$.fn.mask = function(label, delay){
		$(this).each(function() {
			if(delay !== undefined && delay > 0) {
		        var element = $(this);
		        element.data("_mask_timeout", setTimeout(function() { $.maskElement(element, label)}, delay));
			} else {
				$.maskElement($(this), label);
			}
		});
	};
	
	/**
	 * Removes mask from the element(s). Accepts both single and multiple selectors.
	 */
	$.fn.unmask = function(){
		$(this).each(function() {
			$.unmaskElement($(this));
		});
	};
	
	/**
	 * Checks if a single element is masked. Returns false if mask is delayed or not displayed. 
	 */
	$.fn.isMasked = function(){
		return this.hasClass("masked");
	};

	$.maskElement = function(element, label){
	
		//if this element has delayed mask scheduled then remove it and display the new one
		if (element.data("_mask_timeout") !== undefined) {
			clearTimeout(element.data("_mask_timeout"));
			element.removeData("_mask_timeout");
		}

		if(element.isMasked()) {
			$.unmaskElement(element);
		}
		
		if(element.css("position") == "static") {
			element.addClass("masked-relative");
		}
		
		element.addClass("masked");
		
		var maskDiv = $('<div class="loadmask"></div>');
		
		//auto height fix for IE
		if(navigator.userAgent.toLowerCase().indexOf("msie") > -1){
			maskDiv.height(element.height() + parseInt(element.css("padding-top")) + parseInt(element.css("padding-bottom")));
			maskDiv.width(element.width() + parseInt(element.css("padding-left")) + parseInt(element.css("padding-right")));
		}
		
		//fix for z-index bug with selects in IE6
		if(navigator.userAgent.toLowerCase().indexOf("msie 6") > -1){
			element.find("select").addClass("masked-hidden");
		}
		
		element.append(maskDiv);
		
		if(label !== undefined) {
			var maskMsgDiv = $('<div class="loadmask-msg" style="display:none;"></div>');
			maskMsgDiv.append('<div>' + label + '</div>');
			element.append(maskMsgDiv);
			
			//calculate center position
			maskMsgDiv.css("top", Math.round(element.height() / 2 - (maskMsgDiv.height() - parseInt(maskMsgDiv.css("padding-top")) - parseInt(maskMsgDiv.css("padding-bottom"))) / 2)+"px");
			maskMsgDiv.css("left", Math.round(element.width() / 2 - (maskMsgDiv.width() - parseInt(maskMsgDiv.css("padding-left")) - parseInt(maskMsgDiv.css("padding-right"))) / 2)+"px");
			
			maskMsgDiv.show();
		}
		
	};
	
	$.unmaskElement = function(element){
		//if this element has delayed mask scheduled then remove it
		if (element.data("_mask_timeout") !== undefined) {
			clearTimeout(element.data("_mask_timeout"));
			element.removeData("_mask_timeout");
		}
		
		element.find(".loadmask-msg,.loadmask").remove();
		element.removeClass("masked");
		element.removeClass("masked-relative");
		element.find("select").removeClass("masked-hidden");
	};
 
})(jQuery);

/*
 * jQuery autoResize (textarea auto-resizer)
 * @copyright James Padolsey http://james.padolsey.com
 * @version 1.04
 */

jQuery.fn.autoResize = function(options) {
        
    // Just some abstracted details,
    // to make plugin users happy:
    var settings = $.extend({
        onResize : function(){},
        animate : true,
        animateDuration : 150,
        animateCallback : function(){},
        extraSpace : 20,
        limit: 1000
    }, options);

    // Only textarea's auto-resize:
    this.filter('textarea').each(function(){

            // Get rid of scrollbars and disable WebKit resizing:
        var textarea = $(this).css({resize:'none','overflow-y':'hidden'}),

            // Cache original height, for use later:
            origHeight = textarea.height(),

            // Need clone of textarea, hidden off screen:
            clone = (function(){

                // Properties which may effect space taken up by chracters:
                var props = ['height','width','lineHeight','textDecoration','letterSpacing'],
                    propOb = {};

                // Create object of styles to apply:
                $.each(props, function(i, prop){
                    propOb[prop] = textarea.css(prop);
                });

                // Clone the actual textarea removing unique properties
                // and insert before original textarea:
                return textarea.clone().removeAttr('id').removeAttr('name').css({
                    position: 'absolute',
                    top: 0,
                    left: -9999
                }).css(propOb).attr('tabIndex','-1').insertBefore(textarea);

            })(),
            lastScrollTop = null,
            updateSize = function() {

                // Prepare the clone:
                clone.height(0).val($(this).val()).scrollTop(10000);

                // Find the height of text:
                var scrollTop = Math.max(clone.scrollTop(), origHeight) + settings.extraSpace,
                    toChange = $(this).add(clone);

                // Don't do anything if scrollTip hasen't changed:
                if (lastScrollTop === scrollTop) {return;}
                lastScrollTop = scrollTop;

                // Check for limit:
                if ( scrollTop >= settings.limit ) {
                    $(this).css('overflow-y','');
                    return;
                }
                // Fire off callback:
                settings.onResize.call(this);

                // Either animate or directly apply height:
                settings.animate && textarea.css('display') === 'block' ?
                    toChange.stop().animate({height:scrollTop}, settings.animateDuration, settings.animateCallback)
                    : toChange.height(scrollTop);
            };

        // Bind namespaced handlers to appropriate events:
        textarea
            .unbind('.dynSiz')
            .bind('keyup.dynSiz', updateSize)
            .bind('keydown.dynSiz', updateSize)
            .bind('change.dynSiz', updateSize);

    });

    // Chain:
    return this;

};

/**
 * @preserve jQuery DateTimePicker plugin v2.3.4
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * (c) 2014, Chupurnov Valeriy.
 */
(function( $ ) {
	'use strict';
	var default_options  = {
		i18n:{
			ar: { // Arabic
				months: [
					"ÙƒØ§Ù†ÙˆÙ† Ø§Ù„Ø«Ø§Ù†ÙŠ", "Ø´Ø¨Ø§Ø·", "Ø¢Ø°Ø§Ø±", "Ù†ÙŠØ³Ø§Ù†", "Ù…Ø§ÙŠÙˆ", "Ø­Ø²ÙŠØ±Ø§Ù†", "ØªÙ…ÙˆØ²", "Ø¢Ø¨", "Ø£ÙŠÙ„ÙˆÙ„", "ØªØ´Ø±ÙŠÙ† Ø§Ù„Ø£ÙˆÙ„", "ØªØ´Ø±ÙŠÙ† Ø§Ù„Ø«Ø§Ù†ÙŠ", "ÙƒØ§Ù†ÙˆÙ† Ø§Ù„Ø£ÙˆÙ„"
				],
				dayOfWeek: [
					"Ù†", "Ø«", "Ø¹", "Ø®", "Ø¬", "Ø³", "Ø­"
				]
			},
			ro: { // Romanian
				months: [
					"ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"
				],
				dayOfWeek: [
					"l", "ma", "mi", "j", "v", "s", "d"
				]
			},
			id: { // Indonesian
				months: [
					"Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
				],
				dayOfWeek: [
					"Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
				]
			},
			bg:{ // Bulgarian
				months:[
					"Ð¯Ð½ÑƒÐ°Ñ€Ð¸", "Ð¤ÐµÐ²Ñ€ÑƒÐ°Ñ€Ð¸", "ÐœÐ°Ñ€Ñ‚", "ÐÐ¿Ñ€Ð¸Ð»", "ÐœÐ°Ð¹", "Ð®Ð½Ð¸", "Ð®Ð»Ð¸", "ÐÐ²Ð³ÑƒÑÑ‚", "Ð¡ÐµÐ¿Ñ‚ÐµÐ¼Ð²Ñ€Ð¸", "ÐžÐºÑ‚Ð¾Ð¼Ð²Ñ€Ð¸", "ÐÐ¾ÐµÐ¼Ð²Ñ€Ð¸", "Ð”ÐµÐºÐµÐ¼Ð²Ñ€Ð¸"
				],
				dayOfWeek:[
					"ÐÐ´", "ÐŸÐ½", "Ð’Ñ‚", "Ð¡Ñ€", "Ð§Ñ‚", "ÐŸÑ‚", "Ð¡Ð±"
				]
			},
			fa:{ // Persian/Farsi
				months:[
					'ÙØ±ÙˆØ±Ø¯ÛŒÙ†', 'Ø§Ø±Ø¯ÛŒØ¨Ù‡Ø´Øª', 'Ø®Ø±Ø¯Ø§Ø¯', 'ØªÛŒØ±', 'Ù…Ø±Ø¯Ø§Ø¯', 'Ø´Ù‡Ø±ÛŒÙˆØ±', 'Ù…Ù‡Ø±', 'Ø¢Ø¨Ø§Ù†', 'Ø¢Ø°Ø±', 'Ø¯ÛŒ', 'Ø¨Ù‡Ù…Ù†', 'Ø§Ø³ÙÙ†Ø¯'
				],
				dayOfWeek:[
					'ÛŒÚ©Ø´Ù†Ø¨Ù‡', 'Ø¯ÙˆØ´Ù†Ø¨Ù‡', 'Ø³Ù‡ Ø´Ù†Ø¨Ù‡', 'Ú†Ù‡Ø§Ø±Ø´Ù†Ø¨Ù‡', 'Ù¾Ù†Ø¬Ø´Ù†Ø¨Ù‡', 'Ø¬Ù…Ø¹Ù‡', 'Ø´Ù†Ø¨Ù‡'
				]
			},
			ru:{ // Russian
				months:[
					'Ð¯Ð½Ð²Ð°Ñ€ÑŒ','Ð¤ÐµÐ²Ñ€Ð°Ð»ÑŒ','ÐœÐ°Ñ€Ñ‚','ÐÐ¿Ñ€ÐµÐ»ÑŒ','ÐœÐ°Ð¹','Ð˜ÑŽÐ½ÑŒ','Ð˜ÑŽÐ»ÑŒ','ÐÐ²Ð³ÑƒÑÑ‚','Ð¡ÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ','ÐžÐºÑ‚ÑÐ±Ñ€ÑŒ','ÐÐ¾ÑÐ±Ñ€ÑŒ','Ð”ÐµÐºÐ°Ð±Ñ€ÑŒ'
				],
				dayOfWeek:[
					"Ð’ÑÐº", "ÐŸÐ½", "Ð’Ñ‚", "Ð¡Ñ€", "Ð§Ñ‚", "ÐŸÑ‚", "Ð¡Ð±"
				]
			},
			uk:{ // Ukrainian
				months:[
					'Ð¡Ñ–Ñ‡ÐµÐ½ÑŒ','Ð›ÑŽÑ‚Ð¸Ð¹','Ð‘ÐµÑ€ÐµÐ·ÐµÐ½ÑŒ','ÐšÐ²Ñ–Ñ‚ÐµÐ½ÑŒ','Ð¢Ñ€Ð°Ð²ÐµÐ½ÑŒ','Ð§ÐµÑ€Ð²ÐµÐ½ÑŒ','Ð›Ð¸Ð¿ÐµÐ½ÑŒ','Ð¡ÐµÑ€Ð¿ÐµÐ½ÑŒ','Ð’ÐµÑ€ÐµÑÐµÐ½ÑŒ','Ð–Ð¾Ð²Ñ‚ÐµÐ½ÑŒ','Ð›Ð¸ÑÑ‚Ð¾Ð¿Ð°Ð´','Ð“Ñ€ÑƒÐ´ÐµÐ½ÑŒ'
				],
				dayOfWeek:[
					"ÐÐ´Ð»", "ÐŸÐ½Ð´", "Ð’Ñ‚Ñ€", "Ð¡Ñ€Ð´", "Ð§Ñ‚Ð²", "ÐŸÑ‚Ð½", "Ð¡Ð±Ñ‚"
				]
			},
			en:{ // English
				months: [
					"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
				],
				dayOfWeek: [
					"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
				]
			},
			el:{ // Î•Î»Î»Î·Î½Î¹ÎºÎ¬
				months: [
					"Î™Î±Î½Î¿Ï…Î¬ÏÎ¹Î¿Ï‚", "Î¦ÎµÎ²ÏÎ¿Ï…Î¬ÏÎ¹Î¿Ï‚", "ÎœÎ¬ÏÏ„Î¹Î¿Ï‚", "Î‘Ï€ÏÎ¯Î»Î¹Î¿Ï‚", "ÎœÎ¬Î¹Î¿Ï‚", "Î™Î¿ÏÎ½Î¹Î¿Ï‚", "Î™Î¿ÏÎ»Î¹Î¿Ï‚", "Î‘ÏÎ³Î¿Ï…ÏƒÏ„Î¿Ï‚", "Î£ÎµÏ€Ï„Î­Î¼Î²ÏÎ¹Î¿Ï‚", "ÎŸÎºÏ„ÏŽÎ²ÏÎ¹Î¿Ï‚", "ÎÎ¿Î­Î¼Î²ÏÎ¹Î¿Ï‚", "Î”ÎµÎºÎ­Î¼Î²ÏÎ¹Î¿Ï‚"
				],
				dayOfWeek: [
					"ÎšÏ…Ï", "Î”ÎµÏ…", "Î¤ÏÎ¹", "Î¤ÎµÏ„", "Î ÎµÎ¼", "Î Î±Ï", "Î£Î±Î²"
				]
			},
			de:{ // German
				months:[
					'Januar','Februar','MÃ¤rz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'
				],
				dayOfWeek:[
					"So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
				]
			},
			nl:{ // Dutch
				months:[
					"januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"
				],
				dayOfWeek:[
					"zo", "ma", "di", "wo", "do", "vr", "za"
				]
			},
			tr:{ // Turkish
				months:[
					"Ocak", "Åžubat", "Mart", "Nisan", "MayÄ±s", "Haziran", "Temmuz", "AÄŸustos", "EylÃ¼l", "Ekim", "KasÄ±m", "AralÄ±k"
				],
				dayOfWeek:[
					"Paz", "Pts", "Sal", "Ã‡ar", "Per", "Cum", "Cts"
				]
			},
			fr:{ //French
				months:[
			    "Janvier", "FÃ©vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "AoÃ»t", "Septembre", "Octobre", "Novembre", "DÃ©cembre"
				],
				dayOfWeek:[
					"Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
				]
			},
			es:{ // Spanish
				months: [
					"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
				],
				dayOfWeek: [
					"Dom", "Lun", "Mar", "MiÃ©", "Jue", "Vie", "SÃ¡b"
				]
			},
			th:{ // Thai
				months:[
					'à¸¡à¸à¸£à¸²à¸„à¸¡','à¸à¸¸à¸¡à¸ à¸²à¸žà¸±à¸™à¸˜à¹Œ','à¸¡à¸µà¸™à¸²à¸„à¸¡','à¹€à¸¡à¸©à¸²à¸¢à¸™','à¸žà¸¤à¸©à¸ à¸²à¸„à¸¡','à¸¡à¸´à¸–à¸¸à¸™à¸²à¸¢à¸™','à¸à¸£à¸à¸Žà¸²à¸„à¸¡','à¸ªà¸´à¸‡à¸«à¸²à¸„à¸¡','à¸à¸±à¸™à¸¢à¸²à¸¢à¸™','à¸•à¸¸à¸¥à¸²à¸„à¸¡','à¸žà¸¤à¸¨à¸ˆà¸´à¸à¸²à¸¢à¸™','à¸˜à¸±à¸™à¸§à¸²à¸„à¸¡'
				],
				dayOfWeek:[
					'à¸­à¸².','à¸ˆ.','à¸­.','à¸ž.','à¸žà¸¤.','à¸¨.','à¸ª.'
				]
			},
			pl:{ // Polish
				months: [
					"styczeÅ„", "luty", "marzec", "kwiecieÅ„", "maj", "czerwiec", "lipiec", "sierpieÅ„", "wrzesieÅ„", "paÅºdziernik", "listopad", "grudzieÅ„"
				],
				dayOfWeek: [
					"nd", "pn", "wt", "Å›r", "cz", "pt", "sb"
				]
			},
			pt:{ // Portuguese
				months: [
					"Janeiro", "Fevereiro", "MarÃ§o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
				],
				dayOfWeek: [
					"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
				]
			},
			ch:{ // Simplified Chinese
				months: [
					"ä¸€æœˆ","äºŒæœˆ","ä¸‰æœˆ","å››æœˆ","äº”æœˆ","å…­æœˆ","ä¸ƒæœˆ","å…«æœˆ","ä¹æœˆ","åæœˆ","åä¸€æœˆ","åäºŒæœˆ"
				],
				dayOfWeek: [
					"æ—¥", "ä¸€","äºŒ","ä¸‰","å››","äº”","å…­"
				]
			},
			se:{ // Swedish
				months: [
					"Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September","Oktober", "November", "December"
				],
				dayOfWeek: [
					"SÃ¶n", "MÃ¥n", "Tis", "Ons", "Tor", "Fre", "LÃ¶r"
				]
			},
			kr:{ // Korean
				months: [
					"1ì›”", "2ì›”", "3ì›”", "4ì›”", "5ì›”", "6ì›”", "7ì›”", "8ì›”", "9ì›”", "10ì›”", "11ì›”", "12ì›”"
				],
				dayOfWeek: [
					"ì¼", "ì›”", "í™”", "ìˆ˜", "ëª©", "ê¸ˆ", "í† "
				]
			},
			it:{ // Italian
				months: [
					"Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
				],
				dayOfWeek: [
					"Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
				]
			},
			da:{ // Dansk
				months: [
					"January", "Februar", "Marts", "April", "Maj", "Juni", "July", "August", "September", "Oktober", "November", "December"
				],
				dayOfWeek: [
					"SÃ¸n", "Man", "Tir", "Ons", "Tor", "Fre", "LÃ¸r"
				]
			},
			no:{ // Norwegian
				months: [
					"Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"
				],
				dayOfWeek: [
					"SÃ¸n", "Man", "Tir", "Ons", "Tor", "Fre", "LÃ¸r"
				]
			},
			ja:{ // Japanese
				months: [
					"1æœˆ", "2æœˆ", "3æœˆ", "4æœˆ", "5æœˆ", "6æœˆ", "7æœˆ", "8æœˆ", "9æœˆ", "10æœˆ", "11æœˆ", "12æœˆ"
				],
				dayOfWeek: [
					"æ—¥", "æœˆ", "ç«", "æ°´", "æœ¨", "é‡‘", "åœŸ"
				]
			},
			vi:{ // Vietnamese
				months: [
					"Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
				],
				dayOfWeek: [
					"CN", "T2", "T3", "T4", "T5", "T6", "T7"
				]
			},
			sl:{ // SlovenÅ¡Äina
				months: [
					"Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
				],
				dayOfWeek: [
					"Ned", "Pon", "Tor", "Sre", "ÄŒet", "Pet", "Sob"
				]
			},
			cs:{ // ÄŒeÅ¡tina
				months: [
					"Leden", "Ãšnor", "BÅ™ezen", "Duben", "KvÄ›ten", "ÄŒerven", "ÄŒervenec", "Srpen", "ZÃ¡Å™Ã­", "Å˜Ã­jen", "Listopad", "Prosinec"
				],
				dayOfWeek: [
					"Ne", "Po", "Ãšt", "St", "ÄŒt", "PÃ¡", "So"
				]
			},
			hu:{ // Hungarian
			    months: [
					"JanuÃ¡r", "FebruÃ¡r", "MÃ¡rcius", "Ãprilis", "MÃ¡jus", "JÃºnius", "JÃºlius", "Augusztus", "Szeptember", "OktÃ³ber", "November", "December"
			    ],
			    dayOfWeek: [
					"Va", "HÃ©", "Ke", "Sze", "Cs", "PÃ©", "Szo"
			    ]
			}
		},
		value:'',
		lang:'vi',
		
		format:	'Y/m/d H:i',
		formatTime:	'H:i',
		formatDate:	'Y/m/d',
		
		startDate:	false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05', 
		
		step:60,
		monthChangeSpinner:true,
		closeOnDateSelect:false,
		closeOnWithoutClick:true,
		closeOnInputClick: true,
		
		timepicker:true,
		datepicker:true,
		weeks:false,
		
		defaultTime:false,		// use formatTime format (ex. '10:00' for formatTime:	'H:i')
		defaultDate:false, 		// use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')
		
		minDate:false,
		maxDate:false,
		minTime:false,
		maxTime:false,
		
		allowTimes:[],
		opened:false,
		initTime:true,
		inline:false,
		
		onSelectDate:function() {},
		onSelectTime:function() {},
		onChangeMonth:function() {},
		onChangeDateTime:function() {},
		onShow:function() {},
		onClose:function() {},
		onGenerate:function() {},
		
		withoutCopyright:true,
		
		inverseButton:false,
		hours12:false,
		next:	'xdsoft_next',
		prev : 'xdsoft_prev',
		dayOfWeekStart:0,
		
		timeHeightInTimePicker:25,
		timepickerScrollbar:true,
		
		todayButton:true, // 2.1.0
		defaultSelect:true, // 2.1.0
		
		scrollMonth:true,
		scrollTime:true,
		scrollInput:true,
		
		lazyInit:false,
		
		mask:false,
		validateOnBlur:true,
		allowBlank:true,
		
		yearStart:1950,
		yearEnd:2050,
		
		style:'',
		id:'',
		
		fixed: false,
		
		roundTime:'round', // ceil, floor
		className:'',
		
		weekends	: 	[],
		yearOffset:0,
		beforeShowDay: null
	};
	
	// fix for ie8
	if ( !Array.prototype.indexOf ) {
		Array.prototype.indexOf = function(obj, start) {
			 for (var i = (start || 0), j = this.length; i < j; i++) {
				 if (this[i] === obj) { return i; }
			 }
			 return -1;
		}
	}
	
	Date.prototype.countDaysInMonth = function(){
		return new Date(this.getFullYear(), this.getMonth()+1, 0).getDate();
	};
	
	$.fn.xdsoftScroller = function( _percent ) {
		return this.each(function() {
			var timeboxparent = $(this);
			if( !$(this).hasClass('xdsoft_scroller_box') ) {
				var pointerEventToXY = function( e ) {
						var out = {x:0, y:0};
						if( e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel' ) {
							var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
							out.x = touch.pageX;
							out.y = touch.pageY;
						}else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
							out.x = e.pageX;
							out.y = e.pageY;
						}
						return out;
					},
					move = 0,
					timebox = timeboxparent.children().eq(0),
					parentHeight = timeboxparent[0].clientHeight,
					height = timebox[0].offsetHeight,
					scrollbar = $('<div class="xdsoft_scrollbar"></div>'),
					scroller = $('<div class="xdsoft_scroller"></div>'),
					maximumOffset = 100,
					start = false;

				scrollbar.append(scroller);

				timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
				scroller.on('mousedown.xdsoft_scroller',function ( event ) {
					if( !parentHeight )
						timeboxparent.trigger('resize_scroll.xdsoft_scroller',[_percent]);
					var pageY = event.pageY,
						top = parseInt(scroller.css('margin-top')),
						h1 = scrollbar[0].offsetHeight;
					$(document.body).addClass('xdsoft_noselect');
					$([document.body,window]).on('mouseup.xdsoft_scroller',function arguments_callee() {
						$([document.body,window]).off('mouseup.xdsoft_scroller',arguments_callee)
							.off('mousemove.xdsoft_scroller',move)
							.removeClass('xdsoft_noselect');
					});
					$(document.body).on('mousemove.xdsoft_scroller',move = function(event) {
						var offset = event.pageY-pageY+top;
						if( offset<0 )
							offset = 0;
						if( offset+scroller[0].offsetHeight>h1 )
							offset = h1-scroller[0].offsetHeight;
						timeboxparent.trigger('scroll_element.xdsoft_scroller',[maximumOffset?offset/maximumOffset:0]);
					});
				});

				timeboxparent
					.on('scroll_element.xdsoft_scroller',function( event,percent ) {
						if( !parentHeight )
							timeboxparent.trigger('resize_scroll.xdsoft_scroller',[percent,true]);
						percent = percent>1?1:(percent<0||isNaN(percent))?0:percent;
						scroller.css('margin-top',maximumOffset*percent);
						setTimeout(function(){
							timebox.css('marginTop',-parseInt((timebox[0].offsetHeight-parentHeight)*percent))
						},10);						
					})
					.on('resize_scroll.xdsoft_scroller',function( event,_percent,noTriggerScroll ) {
						parentHeight = timeboxparent[0].clientHeight;
						height = timebox[0].offsetHeight;
						var percent = parentHeight/height,
							sh = percent*scrollbar[0].offsetHeight;
						if( percent>1 )
							scroller.hide();
						else{
							scroller.show();
							scroller.css('height',parseInt(sh>10?sh:10));
							maximumOffset = scrollbar[0].offsetHeight-scroller[0].offsetHeight;
							if( noTriggerScroll!==true )
								timeboxparent.trigger('scroll_element.xdsoft_scroller',[_percent?_percent:Math.abs(parseInt(timebox.css('marginTop')))/(height-parentHeight)]);
						}
					});
				timeboxparent.mousewheel&&timeboxparent.mousewheel(function(event, delta, deltaX, deltaY) {
					var top = Math.abs(parseInt(timebox.css('marginTop')));
					timeboxparent.trigger('scroll_element.xdsoft_scroller',[(top-delta*20)/(height-parentHeight)]);
					event.stopPropagation();
					return false;
				});
				timeboxparent.on('touchstart',function( event ) {
					start = pointerEventToXY(event);
				});
				timeboxparent.on('touchmove',function( event ) {
					if( start ) {
						var coord = pointerEventToXY(event), top = Math.abs(parseInt(timebox.css('marginTop')));
						timeboxparent.trigger('scroll_element.xdsoft_scroller',[(top-(coord.y-start.y))/(height-parentHeight)]);
						event.stopPropagation();
						event.preventDefault();
						start = pointerEventToXY(event);
					}
				});
				timeboxparent.on('touchend touchcancel',function( event ) {
					start = false;
				});
			}
			timeboxparent.trigger('resize_scroll.xdsoft_scroller',[_percent]);
		});
	};
	$.fn.datetimepicker = function( opt ) {
		var KEY0 = 48,
			KEY9 = 57,
			_KEY0 = 96,
			_KEY9 = 105,
			CTRLKEY = 17,
			DEL = 46,
			ENTER = 13,
			ESC = 27,
			BACKSPACE = 8,
			ARROWLEFT = 37,
			ARROWUP = 38,
			ARROWRIGHT = 39,
			ARROWDOWN = 40,
			TAB = 9,
			F5 = 116,
			AKEY = 65,
			CKEY = 67,
			VKEY = 86,
			ZKEY = 90,
			YKEY = 89,
			ctrlDown	=	false,
			options = ($.isPlainObject(opt)||!opt)?$.extend(true,{},default_options,opt):$.extend({},default_options),

			lazyInitTimer = 0,

			lazyInit = function( input ){
				input
					.on('open.xdsoft focusin.xdsoft mousedown.xdsoft',function initOnActionCallback(event) {
						if( input.is(':disabled')||input.is(':hidden')||!input.is(':visible')||input.data( 'xdsoft_datetimepicker') )
							return;
				
						clearTimeout(lazyInitTimer);
						
						lazyInitTimer = setTimeout(function() {

							if( !input.data( 'xdsoft_datetimepicker') )
								createDateTimePicker(input);
								
							input
								.off('open.xdsoft focusin.xdsoft mousedown.xdsoft',initOnActionCallback)
								.trigger('open.xdsoft');
						},100);
						
					});
			},
			
			createDateTimePicker = function( input ) {
				
				var datetimepicker = $('<div '+(options.id?'id="'+options.id+'"':'')+' '+(options.style?'style="'+options.style+'"':'')+' class="xdsoft_datetimepicker xdsoft_noselect '+(options.weeks?' xdsoft_showweeks':'')+options.className+'"></div>'),
					xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),
					datepicker = $('<div class="xdsoft_datepicker active"></div>'),
					mounth_picker = $('<div class="xdsoft_mounthpicker"><button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button><div class="xdsoft_label xdsoft_month"><span></span></div><div class="xdsoft_label xdsoft_year"><span></span></div><button type="button" class="xdsoft_next"></button></div>'),
					calendar = $('<div class="xdsoft_calendar"></div>'),
					timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'),
					timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
					timebox = $('<div class="xdsoft_time_variant"></div>'),
					scrollbar = $('<div class="xdsoft_scrollbar"></div>'),
					scroller = $('<div class="xdsoft_scroller"></div>'),
					monthselect =$('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
					yearselect =$('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>');

				//constructor lego
				mounth_picker
					.find('.xdsoft_month span')
						.after(monthselect);
				mounth_picker
					.find('.xdsoft_year span')
						.after(yearselect);

				mounth_picker
					.find('.xdsoft_month,.xdsoft_year')
						.on('mousedown.xdsoft',function(event) {
							mounth_picker
								.find('.xdsoft_select')
									.hide();
									
							var select = $(this).find('.xdsoft_select').eq(0),
								val = 0,
								top = 0;

							if( _xdsoft_datetime.currentTime )
								val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month')?'getMonth':'getFullYear']();

							select.show();
							
							for(var items = select.find('div.xdsoft_option'),i = 0;i<items.length;i++) {
								if( items.eq(i).data('value')==val ) {
									break;
								}else top+=items[0].offsetHeight;
							}

							select.xdsoftScroller(top/(select.children()[0].offsetHeight-(select[0].clientHeight)));
							event.stopPropagation();
							
							return false;
						});

				mounth_picker
					.find('.xdsoft_select')
						.xdsoftScroller()
						.on('mousedown.xdsoft',function( event ) {
							event.stopPropagation();
							event.preventDefault();
						})
						.on('mousedown.xdsoft','.xdsoft_option',function( event ) {
							if( _xdsoft_datetime&&_xdsoft_datetime.currentTime )
								_xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect')?'setMonth':'setFullYear']($(this).data('value'));
							
							$(this).parent().parent().hide();
							
							datetimepicker.trigger('xchange.xdsoft');
							options.onChangeMonth&&options.onChangeMonth.call&&options.onChangeMonth.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						});


				// set options
				datetimepicker.setOptions = function( _options ) {
					options = $.extend(true,{},options,_options);
					
					if( _options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length ){
						options['allowTimes'] = $.extend(true,[],_options.allowTimes);
					}
					
					if( _options.weekends && $.isArray(_options.weekends) && _options.weekends.length ){
						options['weekends'] = $.extend(true,[],_options.weekends);
					}
					
					if( (options.open||options.opened)&&(!options.inline) ) {
						input.trigger('open.xdsoft');
					}

					if( options.inline ) {
						triggerAfterOpen = true;
						datetimepicker.addClass('xdsoft_inline');
						input.after(datetimepicker).hide();
					}

					if( options.inverseButton ) {
						options.next = 'xdsoft_prev';
						options.prev = 'xdsoft_next';
					}

					if( options.datepicker )
						datepicker.addClass('active');
					else
						datepicker.removeClass('active');

					if( options.timepicker )
						timepicker.addClass('active');
					else
						timepicker.removeClass('active');

					if( options.value ){
						input&&input.val&&input.val(options.value);
						_xdsoft_datetime.setCurrentTime(options.value);
					}

					if( isNaN(options.dayOfWeekStart) )
						options.dayOfWeekStart = 0;
					else
						options.dayOfWeekStart = parseInt(options.dayOfWeekStart)%7;

					if( !options.timepickerScrollbar )
						scrollbar.hide();
					
					if( options.minDate && /^-(.*)$/.test(options.minDate) ){
						options.minDate = _xdsoft_datetime.strToDateTime(options.minDate).dateFormat( options.formatDate );
					}
					
					if( options.maxDate &&  /^\+(.*)$/.test(options.maxDate) ) {
						options.maxDate = _xdsoft_datetime.strToDateTime(options.maxDate).dateFormat( options.formatDate );
					}
					
					mounth_picker
						.find('.xdsoft_today_button')
							.css('visibility',!options.todayButton?'hidden':'visible');

					if( options.mask ) {
						var e,
							getCaretPos = function ( input ) {
								try{
									if ( document.selection && document.selection.createRange ) {
										var range = document.selection.createRange();
										return range.getBookmark().charCodeAt(2) - 2;
									}else
										if ( input.setSelectionRange )
											return input.selectionStart;
								}catch(e) {
									return 0;
								}
							},
							setCaretPos = function ( node,pos ) {
								node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;
								if(!node) {
									return false;
								}else if(node.createTextRange) {
									var textRange = node.createTextRange();
									textRange.collapse(true);
									textRange.moveEnd(pos);
									textRange.moveStart(pos);
									textRange.select();
									return true;
								}else if(node.setSelectionRange) {
									node.setSelectionRange(pos,pos);
									return true;
								}
								return false;
							},
							isValidValue = function ( mask,value ) {
								var reg = mask
									.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g,'\\$1')
									.replace(/_/g,'{digit+}')
									.replace(/([0-9]{1})/g,'{digit$1}')
									.replace(/\{digit([0-9]{1})\}/g,'[0-$1_]{1}')
									.replace(/\{digit[\+]\}/g,'[0-9_]{1}');
								return RegExp(reg).test(value);
							};
						input.off('keydown.xdsoft');
						switch(true) {
							case ( options.mask===true ):
							
								options.mask = options.format
									.replace(/Y/g,'9999')
									.replace(/F/g,'9999')
									.replace(/m/g,'19')
									.replace(/d/g,'39')
									.replace(/H/g,'29')
									.replace(/i/g,'59')
									.replace(/s/g,'59');
									
							case ( $.type(options.mask) == 'string' ):
							
								if( !isValidValue( options.mask,input.val() ) )
									input.val(options.mask.replace(/[0-9]/g,'_'));

								input.on('keydown.xdsoft',function( event ) {
									var val = this.value,
										key = event.which;
										
									switch(true) {
										case (( key>=KEY0&&key<=KEY9 )||( key>=_KEY0&&key<=_KEY9 ))||(key==BACKSPACE||key==DEL):
											var pos = getCaretPos(this),
												digit = ( key!=BACKSPACE&&key!=DEL )?String.fromCharCode((_KEY0 <= key && key <= _KEY9)? key-KEY0 : key):'_';
											
											if( (key==BACKSPACE||key==DEL)&&pos ) {
												pos--;
												digit='_';
											}
											
											while( /[^0-9_]/.test(options.mask.substr(pos,1))&&pos<options.mask.length&&pos>0 )
												pos+=( key==BACKSPACE||key==DEL )?-1:1;

											val = val.substr(0,pos)+digit+val.substr(pos+1);
											if( $.trim(val)=='' ){
												val = options.mask.replace(/[0-9]/g,'_');
											}else{
												if( pos==options.mask.length )
													break;
											}
											
											pos+=(key==BACKSPACE||key==DEL)?0:1;
											while( /[^0-9_]/.test(options.mask.substr(pos,1))&&pos<options.mask.length&&pos>0 )
												pos+=(key==BACKSPACE||key==DEL)?-1:1;
												
											if( isValidValue( options.mask,val ) ) {
												this.value = val;
												setCaretPos(this,pos);
											}else if( $.trim(val)=='' )
												this.value = options.mask.replace(/[0-9]/g,'_');
											else{
												input.trigger('error_input.xdsoft');
											}
										break;
										case ( !!~([AKEY,CKEY,VKEY,ZKEY,YKEY].indexOf(key))&&ctrlDown ):
										 case !!~([ESC,ARROWUP,ARROWDOWN,ARROWLEFT,ARROWRIGHT,F5,CTRLKEY,TAB,ENTER].indexOf(key)):
										return true;
									}
									event.preventDefault();
									return false;
								});
							break;
						}
					}
					if( options.validateOnBlur ) {
						input
							.off('blur.xdsoft')
							.on('blur.xdsoft', function() {
								if( options.allowBlank && !$.trim($(this).val()).length ) {
									$(this).val(null);
									datetimepicker.data('xdsoft_datetime').empty();
								}else if( !Date.parseDate( $(this).val(), options.format ) ) {
									$(this).val((_xdsoft_datetime.now()).dateFormat( options.format ));
									datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
								}
								else{
									datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
 								}
								datetimepicker.trigger('changedatetime.xdsoft');
							});
					}
					options.dayOfWeekStartPrev = (options.dayOfWeekStart==0)?6:options.dayOfWeekStart-1;
					
					datetimepicker
						.trigger('xchange.xdsoft')
						.trigger('afterOpen.xdsoft')
				};

				datetimepicker
					.data('options',options)
					.on('mousedown.xdsoft',function( event ) {
						event.stopPropagation();
						event.preventDefault();
						yearselect.hide();
						monthselect.hide();
						return false;
					});

				var scroll_element = timepicker.find('.xdsoft_time_box');
				scroll_element.append(timebox);
				scroll_element.xdsoftScroller();
				
				datetimepicker.on('afterOpen.xdsoft',function() {
					scroll_element.xdsoftScroller();
				});

				datetimepicker
					.append(datepicker)
					.append(timepicker);

				if( options.withoutCopyright!==true )
					datetimepicker
						.append(xdsoft_copyright);

				datepicker
					.append(mounth_picker)
					.append(calendar);

				$('body').append(datetimepicker);

				var _xdsoft_datetime = new function() {
					var _this = this;
					_this.now = function( norecursion ) {
						var d = new Date();
						
						if( !norecursion && options.defaultDate  ){
							var date = _this.strToDate(options.defaultDate);
							d.setFullYear( date.getFullYear() );
							d.setMonth( date.getMonth() );
							d.setDate( date.getDate() );
						}
						
						if( options.yearOffset  ){
							d.setFullYear(d.getFullYear()+options.yearOffset);
						}
						
						if( !norecursion && options.defaultTime ){
							var time = _this.strtotime(options.defaultTime);
							d.setHours( time.getHours() );
							d.setMinutes( time.getMinutes() );
						}
							
						return d;
					};

					
					_this.isValidDate = function (d) {
						if ( Object.prototype.toString.call(d) !== "[object Date]" )
							return false;
						return !isNaN(d.getTime());
					};

					_this.setCurrentTime = function( dTime ) {
						_this.currentTime = (typeof dTime == 'string')? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime: _this.now();
						datetimepicker.trigger('xchange.xdsoft');
					};

					_this.empty = function() {
						_this.currentTime = null;
					};

					_this.getCurrentTime = function( dTime) {
						return _this.currentTime;
					};

					_this.nextMonth = function() {
						var month = _this.currentTime.getMonth()+1;
						if( month==12 ) {
							_this.currentTime.setFullYear(_this.currentTime.getFullYear()+1);
							month = 0;
						}
						_this.currentTime.setDate(
							Math.min(
								// Day 0 is the last day in the previous month, but we want to know the number of days in the current month, so we need to evaluate the subsequent month (month+1)
								new Date(_this.currentTime.getFullYear(), month+1, 0).getDate(),
								_this.currentTime.getDate()
							)
						);
						_this.currentTime.setMonth(month);
						options.onChangeMonth&&options.onChangeMonth.call&&options.onChangeMonth.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						datetimepicker.trigger('xchange.xdsoft');
						return month;
					};

					_this.prevMonth = function() {
						var month = _this.currentTime.getMonth()-1;
						if( month==-1 ) {
							_this.currentTime.setFullYear(_this.currentTime.getFullYear()-1);
							month = 11;
						}
						_this.currentTime.setDate(
							Math.min(
								// Day 0 is the last day in the previous month, but we want to know the number of days in the current month, so we need to evaluate the subsequent month (month+1)
								new Date(_this.currentTime.getFullYear(), month+1, 0).getDate(),
								_this.currentTime.getDate()
							)
						);
						_this.currentTime.setMonth(month);
						options.onChangeMonth&&options.onChangeMonth.call&&options.onChangeMonth.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						datetimepicker.trigger('xchange.xdsoft');
						return month;
					};

					_this.strToDateTime = function( sDateTime ) {
						if( sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime) )
							return sDateTime;
						
						var tmpDate = [],timeOffset,currentTime;
					
						if( ( tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime) )  && ( tmpDate[2]=Date.parseDate(tmpDate[2], options.formatDate) ) ) {
							timeOffset = tmpDate[2].getTime()-(tmpDate[2].getTimezoneOffset())*60000;
							currentTime = new Date((_xdsoft_datetime.now()).getTime()+parseInt(tmpDate[1]+'1')*timeOffset);
						}else
							currentTime = sDateTime?Date.parseDate(sDateTime, options.format):_this.now();
							
						if( !_this.isValidDate(currentTime) )
							currentTime = _this.now();
							
						return currentTime;
					};

					_this.strToDate = function( sDate ) {
						if( sDate && sDate instanceof Date && _this.isValidDate(sDate) )
							return sDate;
						
						var currentTime = sDate?Date.parseDate(sDate, options.formatDate):_this.now(true);
						if( !_this.isValidDate(currentTime) )
							currentTime = _this.now(true);
							
						return currentTime;
					};

					_this.strtotime = function( sTime ) {
						if( sTime && sTime instanceof Date && _this.isValidDate(sTime) )
							return sTime;
							
						var currentTime = sTime?Date.parseDate(sTime, options.formatTime):_this.now();
						if( !_this.isValidDate(currentTime) )
							currentTime = _this.now(true);
							
						return currentTime;
					};

					_this.str = function() {
						return _this.currentTime.dateFormat(options.format);
					};
					
					_this.currentTime = this.now();
				};
				mounth_picker
					.find('.xdsoft_today_button')
						.on('mousedown.xdsoft',function() {
							datetimepicker.data('changed',true);
							_xdsoft_datetime.setCurrentTime(0);
							datetimepicker.trigger('afterOpen.xdsoft');
						}).on('dblclick.xdsoft',function(){
							input.val( _xdsoft_datetime.str() );
							datetimepicker.trigger('close.xdsoft');
						});
				mounth_picker
					.find('.xdsoft_prev,.xdsoft_next')
						.on('mousedown.xdsoft',function() {
							var $this = $(this),
								timer = 0,
								stop = false;

							(function arguments_callee1(v) {
								var month =  _xdsoft_datetime.currentTime.getMonth();
								if( $this.hasClass( options.next ) ) {
									_xdsoft_datetime.nextMonth();
								}else if( $this.hasClass( options.prev ) ) {
									_xdsoft_datetime.prevMonth();
								}
								if (options.monthChangeSpinner) {
									!stop&&(timer = setTimeout(arguments_callee1,v?v:100));
								}
							})(500);

							$([document.body,window]).on('mouseup.xdsoft',function arguments_callee2() {
								clearTimeout(timer);
								stop = true;
								$([document.body,window]).off('mouseup.xdsoft',arguments_callee2);
							});
						});

				timepicker
					.find('.xdsoft_prev,.xdsoft_next')
						.on('mousedown.xdsoft',function() {
							var $this = $(this),
								timer = 0,
								stop = false,
								period = 110;
							(function arguments_callee4(v) {
								var pheight = timeboxparent[0].clientHeight,
									height = timebox[0].offsetHeight,
									top = Math.abs(parseInt(timebox.css('marginTop')));
								if( $this.hasClass(options.next) && (height-pheight)- options.timeHeightInTimePicker>=top ) {
									timebox.css('marginTop','-'+(top+options.timeHeightInTimePicker)+'px')
								}else if( $this.hasClass(options.prev) && top-options.timeHeightInTimePicker>=0  ) {
									timebox.css('marginTop','-'+(top-options.timeHeightInTimePicker)+'px')
								}
								timeboxparent.trigger('scroll_element.xdsoft_scroller',[Math.abs(parseInt(timebox.css('marginTop'))/(height-pheight))]);
								period= ( period>10 )?10:period-10;
								!stop&&(timer = setTimeout(arguments_callee4,v?v:period));
							})(500);
							$([document.body,window]).on('mouseup.xdsoft',function arguments_callee5() {
								clearTimeout(timer);
								stop = true;
								$([document.body,window])
									.off('mouseup.xdsoft',arguments_callee5);
							});
						});

				var xchangeTimer = 0;
				// base handler - generating a calendar and timepicker
				datetimepicker
					.on('xchange.xdsoft',function( event ) {
						clearTimeout(xchangeTimer);
						xchangeTimer = setTimeout(function(){
							var table 	=	'',
									start	= new Date(_xdsoft_datetime.currentTime.getFullYear(),_xdsoft_datetime.currentTime.getMonth(),1, 12, 0, 0),
									i = 0,
									today = _xdsoft_datetime.now();
								
								while( start.getDay()!=options.dayOfWeekStart )
									start.setDate(start.getDate()-1);

								//generate calendar
								table+='<table><thead><tr>';

								if(options.weeks) {
									table+='<th></th>';
								}

								// days
								for(var j = 0; j<7; j++) {
									table+='<th>'+options.i18n[options.lang].dayOfWeek[(j+options.dayOfWeekStart)%7]+'</th>';
								}

								table+='</tr></thead>';
								table+='<tbody>';
								var maxDate = false, minDate = false;
								
								if( options.maxDate!==false ) {
									maxDate = _xdsoft_datetime.strToDate(options.maxDate);
									maxDate = new Date(maxDate.getFullYear(),maxDate.getMonth(),maxDate.getDate(),23,59,59,999);
								}
								
								if( options.minDate!==false ) {
									minDate = _xdsoft_datetime.strToDate(options.minDate);
									minDate = new Date(minDate.getFullYear(),minDate.getMonth(),minDate.getDate());
								}
								
								var d,y,m,w,classes = [],customDateSettings,newRow=true;
								
								while( i<_xdsoft_datetime.currentTime.countDaysInMonth()||start.getDay()!=options.dayOfWeekStart||_xdsoft_datetime.currentTime.getMonth()==start.getMonth() ) {
									classes = [];
									i++;

									d = start.getDate(); y = start.getFullYear(); m = start.getMonth(); w = start.getWeekOfYear();

									classes.push('xdsoft_date');

									if ( options.beforeShowDay && options.beforeShowDay.call ) {
										customDateSettings = options.beforeShowDay.call(datetimepicker, start);
									} else {
										customDateSettings = null;
									}

									if( ( maxDate!==false && start > maxDate )||(  minDate!==false && start < minDate )||(customDateSettings && customDateSettings[0] === false) ){
										classes.push('xdsoft_disabled');
									}

									if ( customDateSettings && customDateSettings[1] != "" ) {
										classes.push(customDateSettings[1]);
									}

									if( _xdsoft_datetime.currentTime.getMonth()!=m ) classes.push('xdsoft_other_month');

									if( (options.defaultSelect||datetimepicker.data('changed')) && _xdsoft_datetime.currentTime.dateFormat( options.formatDate )==start.dateFormat( options.formatDate ) ) {
										classes.push('xdsoft_current');
									}

									if( today.dateFormat( options.formatDate )==start.dateFormat( options.formatDate ) ) {
										classes.push('xdsoft_today');
									}

									if( start.getDay()==0||start.getDay()==6||~options.weekends.indexOf(start.dateFormat( options.formatDate )) ) {
										classes.push('xdsoft_weekend');
									}

									if(options.beforeShowDay && typeof options.beforeShowDay == 'function') {
										classes.push(options.beforeShowDay(start))
									}

									if(newRow) {
										table+='<tr>';
										newRow = false;
										
										if(options.weeks) {
											table+='<th>'+w+'</th>';
										}
									}

									table+='<td data-date="'+d+'" data-month="'+m+'" data-year="'+y+'"'+' class="xdsoft_date xdsoft_day_of_week'+start.getDay()+' '+ classes.join(' ')+'">'+
												'<div>'+d+'</div>'+
											'</td>';

									if( start.getDay()==options.dayOfWeekStartPrev ) {
										table+='</tr>';
										newRow = true;
									}

									start.setDate(d+1);
								}
								table+='</tbody></table>';

								calendar.html(table);

								mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[options.lang].months[_xdsoft_datetime.currentTime.getMonth()]);
								mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());

								// generate timebox
								var time = '',
									h = '',
									m ='',
									line_time = function line_time( h,m ) {
										var now = _xdsoft_datetime.now();
										now.setHours(h);
										h = parseInt(now.getHours());
										now.setMinutes(m);
										m = parseInt(now.getMinutes());

										classes = [];
										if( (options.maxTime!==false&&_xdsoft_datetime.strtotime(options.maxTime).getTime()<now.getTime())||(options.minTime!==false&&_xdsoft_datetime.strtotime(options.minTime).getTime()>now.getTime()))
											classes.push('xdsoft_disabled');
										if( (options.initTime||options.defaultSelect||datetimepicker.data('changed')) && parseInt(_xdsoft_datetime.currentTime.getHours())==parseInt(h)&&(options.step>59||Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes()/options.step)*options.step==parseInt(m))) {
											if( options.defaultSelect||datetimepicker.data('changed')) {
												classes.push('xdsoft_current');
											} else if( options.initTime ) {
												classes.push('xdsoft_init_time');
											}
										}
										if( parseInt(today.getHours())==parseInt(h)&&parseInt(today.getMinutes())==parseInt(m))
											classes.push('xdsoft_today');
										time+= '<div class="xdsoft_time '+classes.join(' ')+'" data-hour="'+h+'" data-minute="'+m+'">'+now.dateFormat(options.formatTime)+'</div>';
									};

								if( !options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length ) {
									for( var i=0,j=0;i<(options.hours12?12:24);i++ ) {
										for( j=0;j<60;j+=options.step ) {
											h = (i<10?'0':'')+i;
											m = (j<10?'0':'')+j;
											line_time( h,m );
										}
									}
								}else{
									for( var i=0;i<options.allowTimes.length;i++ ) {
										h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
										m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
										line_time( h,m );
									}
								}

								timebox.html(time);

								var opt = '',
									i = 0;

								for( i = parseInt(options.yearStart,10)+options.yearOffset;i<= parseInt(options.yearEnd,10)+options.yearOffset;i++ ) {
									opt+='<div class="xdsoft_option '+(_xdsoft_datetime.currentTime.getFullYear()==i?'xdsoft_current':'')+'" data-value="'+i+'">'+i+'</div>';
								}
								yearselect.children().eq(0)
														.html(opt);

								for( i = 0,opt = '';i<= 11;i++ ) {
									opt+='<div class="xdsoft_option '+(_xdsoft_datetime.currentTime.getMonth()==i?'xdsoft_current':'')+'" data-value="'+i+'">'+options.i18n[options.lang].months[i]+'</div>';
								}
								monthselect.children().eq(0).html(opt);
								$(datetimepicker)
									.trigger('generate.xdsoft');
						},10);
						event.stopPropagation();
					})
					.on('afterOpen.xdsoft',function() {
						if( options.timepicker ) {
							var classType;
							if( timebox.find('.xdsoft_current').length ) {
								classType = '.xdsoft_current';
							} else if( timebox.find('.xdsoft_init_time').length ) {
								classType = '.xdsoft_init_time';
							}
							
							if( classType ) {
								var pheight = timeboxparent[0].clientHeight,
									height = timebox[0].offsetHeight,
									top = timebox.find(classType).index()*options.timeHeightInTimePicker+1;
								if( (height-pheight)<top )
									top = height-pheight;
								timeboxparent.trigger('scroll_element.xdsoft_scroller',[parseInt(top)/(height-pheight)]);
							}else{
								timeboxparent.trigger('scroll_element.xdsoft_scroller',[0]);
							}
						}
					});
				
				var timerclick = 0;
				
				calendar
					.on('click.xdsoft', 'td', function (xdevent) {
					  xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
						timerclick++;
						var $this = $(this),
							currentTime = _xdsoft_datetime.currentTime;
						
						if( currentTime===undefined||currentTime===null ){
                            _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                            currentTime = _xdsoft_datetime.currentTime;
                        }
						
						if( $this.hasClass('xdsoft_disabled') )
							return false;

						currentTime.setDate( 1 );
						currentTime.setFullYear( $this.data('year') );
						currentTime.setMonth( $this.data('month') );
						currentTime.setDate( $this.data('date') );
						
						datetimepicker.trigger('select.xdsoft',[currentTime]);

						input.val( _xdsoft_datetime.str() );
						if( (timerclick>1||(options.closeOnDateSelect===true||( options.closeOnDateSelect===0&&!options.timepicker )))&&!options.inline ) {
							datetimepicker.trigger('close.xdsoft');
						}

						if( options.onSelectDate &&	options.onSelectDate.call ) {
							options.onSelectDate.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						}

						datetimepicker.data('changed',true);
						datetimepicker.trigger('xchange.xdsoft');
						datetimepicker.trigger('changedatetime.xdsoft');
						setTimeout(function(){
							timerclick = 0;
						},200);
					});

				timebox
					.on('click.xdsoft', 'div', function (xdevent) {
					    xdevent.stopPropagation(); // NAJ: Prevents closing of Pop-ups, Modals and Flyouts
						var $this = $(this),
							currentTime = _xdsoft_datetime.currentTime;
						
						if( currentTime===undefined||currentTime===null ){
                            _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                            currentTime = _xdsoft_datetime.currentTime;
                        }
						
						if( $this.hasClass('xdsoft_disabled') )
							return false;
						currentTime.setHours($this.data('hour'));
						currentTime.setMinutes($this.data('minute'));
						datetimepicker.trigger('select.xdsoft',[currentTime]);

						datetimepicker.data('input').val( _xdsoft_datetime.str() );

						!options.inline&&datetimepicker.trigger('close.xdsoft');

						if( options.onSelectTime&&options.onSelectTime.call ) {
							options.onSelectTime.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						}
						datetimepicker.data('changed',true);
						datetimepicker.trigger('xchange.xdsoft');
						datetimepicker.trigger('changedatetime.xdsoft');
					});

				datetimepicker.mousewheel&&datepicker.mousewheel(function(event, delta, deltaX, deltaY) {
					if( !options.scrollMonth )
						return true;
					if( delta<0 )
						_xdsoft_datetime.nextMonth();
					else
						_xdsoft_datetime.prevMonth();
					return false;
				});

				datetimepicker.mousewheel&&timeboxparent.unmousewheel().mousewheel(function(event, delta, deltaX, deltaY) {
					if( !options.scrollTime )
						return true;
					var pheight = timeboxparent[0].clientHeight,
						height = timebox[0].offsetHeight,
						top = Math.abs(parseInt(timebox.css('marginTop'))),
						fl = true;
					if( delta<0 && (height-pheight)-options.timeHeightInTimePicker>=top ) {
						timebox.css('marginTop','-'+(top+options.timeHeightInTimePicker)+'px');
						fl = false;
					}else if( delta>0&&top-options.timeHeightInTimePicker>=0 ) {
						timebox.css('marginTop','-'+(top-options.timeHeightInTimePicker)+'px');
						fl = false;
					}
					timeboxparent.trigger('scroll_element.xdsoft_scroller',[Math.abs(parseInt(timebox.css('marginTop'))/(height-pheight))]);
					event.stopPropagation();
					return fl;
				});
				
				var triggerAfterOpen = false;
				datetimepicker
					.on('changedatetime.xdsoft',function() {
						if( options.onChangeDateTime&&options.onChangeDateTime.call ) {
							var $input = datetimepicker.data('input');
							options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input);
							delete options.value;
							$input.trigger('change');
						}
					})
					.on('generate.xdsoft',function() {
						if( options.onGenerate&&options.onGenerate.call )
							options.onGenerate.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						if( triggerAfterOpen ){
							datetimepicker.trigger('afterOpen.xdsoft');
							triggerAfterOpen = false;
						}
					})
					.on( 'click.xdsoft', function( xdevent )
					{
						xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
					});

				var current_time_index = 0;
				input.mousewheel&&input.mousewheel(function( event, delta, deltaX, deltaY ) {
					if( !options.scrollInput )
						return true;
					if( !options.datepicker && options.timepicker ) {
						current_time_index = timebox.find('.xdsoft_current').length?timebox.find('.xdsoft_current').eq(0).index():0;
						if( current_time_index+delta>=0&&current_time_index+delta<timebox.children().length )
							current_time_index+=delta;
						timebox.children().eq(current_time_index).length&&timebox.children().eq(current_time_index).trigger('mousedown');
						return false;
					}else if( options.datepicker && !options.timepicker ) {
						datepicker.trigger( event, [delta, deltaX, deltaY]);
						input.val&&input.val( _xdsoft_datetime.str() );
						datetimepicker.trigger('changedatetime.xdsoft');
						return false;
					}
				});
				var setPos = function() {
					var offset = datetimepicker.data('input').offset(), top = offset.top+datetimepicker.data('input')[0].offsetHeight-1, left = offset.left, position = "absolute";
					if (options.fixed) {
						top -= $(window).scrollTop();
						left -= $(window).scrollLeft();
						position = "fixed";
					}else {
						if( top+datetimepicker[0].offsetHeight>$(window).height()+$(window).scrollTop() )
							top = offset.top-datetimepicker[0].offsetHeight+1;
							if (top < 0)
								top = 0;
						if( left+datetimepicker[0].offsetWidth>$(window).width() )
							left = offset.left-datetimepicker[0].offsetWidth+datetimepicker.data('input')[0].offsetWidth;
					}
					datetimepicker.css({
						left:left,
						top:top,
						position: position
					});
				};
				datetimepicker
					.on('open.xdsoft', function() {
						var onShow = true;
						if( options.onShow&&options.onShow.call) {
							onShow = options.onShow.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						}
						if( onShow!==false ) {
							datetimepicker.show();
							setPos();
							$(window)
								.off('resize.xdsoft',setPos)
								.on('resize.xdsoft',setPos);

							if( options.closeOnWithoutClick ) {
								$([document.body,window]).on('mousedown.xdsoft',function arguments_callee6() {
									datetimepicker.trigger('close.xdsoft');
									$([document.body,window]).off('mousedown.xdsoft',arguments_callee6);
								});
							}
						}
					})
					.on('close.xdsoft', function( event ) {
						var onClose = true;
						if( options.onClose&&options.onClose.call ) {
							onClose=options.onClose.call(datetimepicker,_xdsoft_datetime.currentTime,datetimepicker.data('input'));
						}
						if( onClose!==false&&!options.opened&&!options.inline ) {
							datetimepicker.hide();
						}
						event.stopPropagation();
					})
					.data('input',input);

				var timer = 0,
					timer1 = 0;

				datetimepicker.data('xdsoft_datetime',_xdsoft_datetime);
				datetimepicker.setOptions(options);
				
				function getCurrentValue(){

					var ct = false;

                    if ( options.startDate ) {
                        ct = _xdsoft_datetime.strToDate(options.startDate);
                    } else {
                        ct = options.value?options.value:(input&&input.val&&input.val())?input.val():'';
						if( ct ) {
							ct = _xdsoft_datetime.strToDateTime(ct);
						} else if ( options.defaultDate ) {
							ct = _xdsoft_datetime.strToDate(options.defaultDate);
						}
                    }

					if ( ct && _xdsoft_datetime.isValidDate(ct) ) {
						datetimepicker.data('changed',true);
					} else {
                        ct = '';
                    }
					
					return ct?ct:0;
				}
				//debugger
				_xdsoft_datetime.setCurrentTime( getCurrentValue() );

				input
					.data( 'xdsoft_datetimepicker',datetimepicker )
					.on('open.xdsoft focusin.xdsoft mousedown.xdsoft',function(event) {
						if( input.is(':disabled')||input.is(':hidden')||!input.is(':visible')||(input.data('xdsoft_datetimepicker').is(':visible') && options.closeOnInputClick) )
							return;
						clearTimeout(timer);
						timer = setTimeout(function() {
							if( input.is(':disabled')||input.is(':hidden')||!input.is(':visible') )
								return;
								
							triggerAfterOpen = true;
							_xdsoft_datetime.setCurrentTime(getCurrentValue());
							
							datetimepicker.trigger('open.xdsoft');
						},100);
					})
					.on('keydown.xdsoft',function( event ) {
						var val = this.value,
							key = event.which;
						switch(true) {
							case !!~([ENTER].indexOf(key)):
								var elementSelector = $("input:visible,textarea:visible");
								datetimepicker.trigger('close.xdsoft');
								elementSelector.eq(elementSelector.index(this) + 1).focus();
							return false;
							case !!~[TAB].indexOf(key):
								datetimepicker.trigger('close.xdsoft');
							return true;
						}
					});
			},
			destroyDateTimePicker = function( input ) {
				var datetimepicker = input.data('xdsoft_datetimepicker');
				if( datetimepicker ) {
					datetimepicker.data('xdsoft_datetime',null);
					datetimepicker.remove();
					input
						.data( 'xdsoft_datetimepicker',null )
						.off( 'open.xdsoft focusin.xdsoft focusout.xdsoft mousedown.xdsoft blur.xdsoft keydown.xdsoft' );
					$(window).off('resize.xdsoft');
					$([window,document.body]).off('mousedown.xdsoft');
					input.unmousewheel&&input.unmousewheel();
				}
			};
		$(document)
			.off('keydown.xdsoftctrl keyup.xdsoftctrl')
			.on('keydown.xdsoftctrl',function(e) {
				if ( e.keyCode == CTRLKEY )
					ctrlDown = true;
			})
			.on('keyup.xdsoftctrl',function(e) {
				if ( e.keyCode == CTRLKEY )
					ctrlDown = false;
			});
		return this.each(function() {
			var datetimepicker;
			if( datetimepicker = $(this).data('xdsoft_datetimepicker') ) {
				if( $.type(opt) === 'string' ) {
					switch(opt) {
						case 'show':
							$(this).select().focus();
							datetimepicker.trigger( 'open.xdsoft' );
						break;
						case 'hide':
							datetimepicker.trigger('close.xdsoft');
						break;
						case 'destroy':
							destroyDateTimePicker($(this));
						break;
						case 'reset':
							this.value = this.defaultValue;
							if(!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(Date.parseDate(this.value, options.format)))
								datetimepicker.data('changed',false);
							datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
						break;
					}
				}else{
					datetimepicker
						.setOptions(opt);
				}
				return 0;
			}else
				if( ($.type(opt) !== 'string') ){
					if( !options.lazyInit||options.open||options.inline ){
						createDateTimePicker($(this));
					}else
						lazyInit($(this));
				}
		});
	};
	$.fn.datetimepicker.defaults = default_options;
})( jQuery );


/*!
 * jQuery contextMenu - Plugin for simple contextMenu handling
 *
 * Version: 1.6.6
 *
 * Authors: Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://medialize.github.com/jQuery-contextMenu/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function($, undefined){
    
    // TODO: -
        // ARIA stuff: menuitem, menuitemcheckbox und menuitemradio
        // create <menu> structure if $.support[htmlCommand || htmlMenuitem] and !opt.disableNative

// determine html5 compatibility
$.support.htmlMenuitem = ('HTMLMenuItemElement' in window);
$.support.htmlCommand = ('HTMLCommandElement' in window);
$.support.eventSelectstart = ("onselectstart" in document.documentElement);
/* // should the need arise, test for css user-select
$.support.cssUserSelect = (function(){
    var t = false,
        e = document.createElement('div');
    
    $.each('Moz|Webkit|Khtml|O|ms|Icab|'.split('|'), function(i, prefix) {
        var propCC = prefix + (prefix ? 'U' : 'u') + 'serSelect',
            prop = (prefix ? ('-' + prefix.toLowerCase() + '-') : '') + 'user-select';
            
        e.style.cssText = prop + ': text;';
        if (e.style[propCC] == 'text') {
            t = true;
            return false;
        }
        
        return true;
    });
    
    return t;
})();
*/

if (!$.ui || !$.ui.widget) {
    // duck punch $.cleanData like jQueryUI does to get that remove event
    // https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js#L16-24
    var _cleanData = $.cleanData;
    $.cleanData = function( elems ) {
        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            try {
                $( elem ).triggerHandler( "remove" );
                // http://bugs.jquery.com/ticket/8235
            } catch( e ) {}
        }
        _cleanData( elems );
    };
}

var // currently active contextMenu trigger
    $currentTrigger = null,
    // is contextMenu initialized with at least one menu?
    initialized = false,
    // window handle
    $win = $(window),
    // number of registered menus
    counter = 0,
    // mapping selector to namespace
    namespaces = {},
    // mapping namespace to options
    menus = {},
    // custom command type handlers
    types = {},
    // default values
    defaults = {
        // selector of contextMenu trigger
        selector: null,
        // where to append the menu to
        appendTo: null,
        // method to trigger context menu ["right", "left", "hover"]
        trigger: "right",
        // hide menu when mouse leaves trigger / menu elements
        autoHide: false,
        // ms to wait before showing a hover-triggered context menu
        delay: 200,
        // flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu
        // as long as the trigger happened on one of the trigger-element's child nodes
        reposition: true,
        // determine position to show menu at
        determinePosition: function($menu) {
            // position to the lower middle of the trigger element
            if ($.ui && $.ui.position) {
                // .position() is provided as a jQuery UI utility
                // (...and it won't work on hidden elements)
                $menu.css('display', 'block').position({
                    my: "center top",
                    at: "center bottom",
                    of: this,
                    offset: "0 5",
                    collision: "fit"
                }).css('display', 'none');
            } else {
                // determine contextMenu position
                var offset = this.offset();
                offset.top += this.outerHeight();
                offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                $menu.css(offset);
            }
        },
        // position menu
        position: function(opt, x, y) {
            var $this = this,
                offset;
            // determine contextMenu position
            if (!x && !y) {
                opt.determinePosition.call(this, opt.$menu);
                return;
            } else if (x === "maintain" && y === "maintain") {
                // x and y must not be changed (after re-show on command click)
                offset = opt.$menu.position();
            } else {
                // x and y are given (by mouse event)
                offset = {top: y, left: x};
            }
            
            // correct offset if viewport demands it
            var bottom = $win.scrollTop() + $win.height(),
                right = $win.scrollLeft() + $win.width(),
                height = opt.$menu.height(),
                width = opt.$menu.width();
            
            if (offset.top + height > bottom) {
                offset.top -= height;
            }
            
            if (offset.left + width > right) {
                offset.left -= width;
            }
            
            opt.$menu.css(offset);
        },
        // position the sub-menu
        positionSubmenu: function($menu) {
            if ($.ui && $.ui.position) {
                // .position() is provided as a jQuery UI utility
                // (...and it won't work on hidden elements)
                $menu.css('display', 'block').position({
                    my: "left top",
                    at: "right top",
                    of: this,
                    collision: "flipfit fit"
                }).css('display', '');
            } else {
                // determine contextMenu position
                var offset = {
                    top: 0,
                    left: this.outerWidth()
                };
                $menu.css(offset);
            }
        },
        // offset to add to zIndex
        zIndex: 1,
        // show hide animation settings
        animation: {
            duration: 50,
            show: 'slideDown',
            hide: 'slideUp'
        },
        // events
        events: {
            show: $.noop,
            hide: $.noop
        },
        // default callback
        callback: null,
        // list of contextMenu items
        items: {}
    },
    // mouse position for hover activation
    hoveract = {
        timer: null,
        pageX: null,
        pageY: null
    },
    // determine zIndex
    zindex = function($t) {
        var zin = 0,
            $tt = $t;

        while (true) {
            zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
            $tt = $tt.parent();
            if (!$tt || !$tt.length || "html body".indexOf($tt.prop('nodeName').toLowerCase()) > -1 ) {
                break;
            }
        }
        
        return zin;
    },
    // event handlers
    handle = {
        // abort anything
        abortevent: function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
        },
        
        // contextmenu show dispatcher
        contextmenu: function(e) {
            var $this = $(this);
            
            // disable actual context-menu
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // abort native-triggered events unless we're triggering on right click
            if (e.data.trigger != 'right' && e.originalEvent) {
                return;
            }
            
            // abort event if menu is visible for this trigger
            if ($this.hasClass('context-menu-active')) {
                return;
            }
            
            if (!$this.hasClass('context-menu-disabled')) {
                // theoretically need to fire a show event at <menu>
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#context-menus
                // var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
                // e.data.$menu.trigger(evt);
                
                $currentTrigger = $this;
                if (e.data.build) {
                    var built = e.data.build($currentTrigger, e);
                    // abort if build() returned false
                    if (built === false) {
                        return;
                    }
                    
                    // dynamically build menu on invocation
                    e.data = $.extend(true, {}, defaults, e.data, built || {});

                    // abort if there are no items to display
                    if (!e.data.items || $.isEmptyObject(e.data.items)) {
                        // Note: jQuery captures and ignores errors from event handlers
                        if (window.console) {
                            (console.error || console.log)("No items specified to show in contextMenu");
                        }
                        
                        throw new Error('No Items specified');
                    }
                    
                    // backreference for custom command type creation
                    e.data.$trigger = $currentTrigger;
                    
                    op.create(e.data);
                }
                // show menu
                op.show.call($this, e.data, e.pageX, e.pageY);
            }
        },
        // contextMenu left-click trigger
        click: function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).trigger($.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
        },
        // contextMenu right-click trigger
        mousedown: function(e) {
            // register mouse down
            var $this = $(this);
            
            // hide any previous menus
            if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
                $currentTrigger.data('contextMenu').$menu.trigger('contextmenu:hide');
            }
            
            // activate on right click
            if (e.button == 2) {
                $currentTrigger = $this.data('contextMenuActive', true);
            }
        },
        // contextMenu right-click trigger
        mouseup: function(e) {
            // show menu
            var $this = $(this);
            if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $currentTrigger = $this;
                $this.trigger($.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
            }
            
            $this.removeData('contextMenuActive');
        },
        // contextMenu hover trigger
        mouseenter: function(e) {
            var $this = $(this),
                $related = $(e.relatedTarget),
                $document = $(document);
            
            // abort if we're coming from a menu
            if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                return;
            }
            
            // abort if a menu is shown
            if ($currentTrigger && $currentTrigger.length) {
                return;
            }
            
            hoveract.pageX = e.pageX;
            hoveract.pageY = e.pageY;
            hoveract.data = e.data;
            $document.on('mousemove.contextMenuShow', handle.mousemove);
            hoveract.timer = setTimeout(function() {
                hoveract.timer = null;
                $document.off('mousemove.contextMenuShow');
                $currentTrigger = $this;
                $this.trigger($.Event("contextmenu", { data: hoveract.data, pageX: hoveract.pageX, pageY: hoveract.pageY }));
            }, e.data.delay );
        },
        // contextMenu hover trigger
        mousemove: function(e) {
            hoveract.pageX = e.pageX;
            hoveract.pageY = e.pageY;
        },
        // contextMenu hover trigger
        mouseleave: function(e) {
            // abort if we're leaving for a menu
            var $related = $(e.relatedTarget);
            if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                return;
            }
            
            try {
                clearTimeout(hoveract.timer);
            } catch(e) {}
            
            hoveract.timer = null;
        },
        
        // click on layer to hide contextMenu
        layerClick: function(e) {
            var $this = $(this),
                root = $this.data('contextMenuRoot'),
                mouseup = false,
                button = e.button,
                x = e.pageX,
                y = e.pageY,
                target, 
                offset,
                selectors;
                
            e.preventDefault();
            e.stopImmediatePropagation();
            
            setTimeout(function() {
                var $window, hideshow, possibleTarget;
                var triggerAction = ((root.trigger == 'left' && button === 0) || (root.trigger == 'right' && button === 2));
                
                // find the element that would've been clicked, wasn't the layer in the way
                if (document.elementFromPoint) {
                    root.$layer.hide();
                    target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                    root.$layer.show();
                }
                
                if (root.reposition && triggerAction) {
                    if (document.elementFromPoint) {
                        if (root.$trigger.is(target) || root.$trigger.has(target).length) {
                            root.position.call(root.$trigger, root, x, y);
                            return;
                        }
                    } else {
                        offset = root.$trigger.offset();
                        $window = $(window);
                        // while this looks kinda awful, it's the best way to avoid
                        // unnecessarily calculating any positions
                        offset.top += $window.scrollTop();
                        if (offset.top <= e.pageY) {
                            offset.left += $window.scrollLeft();
                            if (offset.left <= e.pageX) {
                                offset.bottom = offset.top + root.$trigger.outerHeight();
                                if (offset.bottom >= e.pageY) {
                                    offset.right = offset.left + root.$trigger.outerWidth();
                                    if (offset.right >= e.pageX) {
                                        // reposition
                                        root.position.call(root.$trigger, root, x, y);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (target && triggerAction) {
                    root.$trigger.one('contextmenu:hidden', function() {
                        $(target).contextMenu({x: x, y: y});
                    });
                }

                root.$menu.trigger('contextmenu:hide');
            }, 50);
        },
        // key handled :hover
        keyStop: function(e, opt) {
            if (!opt.isInput) {
                e.preventDefault();
            }
            
            e.stopPropagation();
        },
        key: function(e) {
            var opt = $currentTrigger.data('contextMenu') || {};

            switch (e.keyCode) {
                case 9:
                case 38: // up
                    handle.keyStop(e, opt);
                    // if keyCode is [38 (up)] or [9 (tab) with shift]
                    if (opt.isInput) {
                        if (e.keyCode == 9 && e.shiftKey) {
                            e.preventDefault();
                            opt.$selected && opt.$selected.find('input, textarea, select').blur();
                            opt.$menu.trigger('prevcommand');
                            return;
                        } else if (e.keyCode == 38 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                            // checkboxes don't capture this key
                            e.preventDefault();
                            return;
                        }
                    } else if (e.keyCode != 9 || e.shiftKey) {
                        opt.$menu.trigger('prevcommand');
                        return;
                    }
                    // omitting break;
                    
                // case 9: // tab - reached through omitted break;
                case 40: // down
                    handle.keyStop(e, opt);
                    if (opt.isInput) {
                        if (e.keyCode == 9) {
                            e.preventDefault();
                            opt.$selected && opt.$selected.find('input, textarea, select').blur();
                            opt.$menu.trigger('nextcommand');
                            return;
                        } else if (e.keyCode == 40 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                            // checkboxes don't capture this key
                            e.preventDefault();
                            return;
                        }
                    } else {
                        opt.$menu.trigger('nextcommand');
                        return;
                    }
                    break;
                
                case 37: // left
                    handle.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }
                
                    if (!opt.$selected.parent().hasClass('context-menu-root')) {
                        var $parent = opt.$selected.parent().parent();
                        opt.$selected.trigger('contextmenu:blur');
                        opt.$selected = $parent;
                        return;
                    }
                    break;
                    
                case 39: // right
                    handle.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }
                    
                    var itemdata = opt.$selected.data('contextMenu') || {};
                    if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                        opt.$selected = null;
                        itemdata.$selected = null;
                        itemdata.$menu.trigger('nextcommand');
                        return;
                    }
                    break;
                
                case 35: // end
                case 36: // home
                    if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                        return;
                    } else {
                        (opt.$selected && opt.$selected.parent() || opt.$menu)
                            .children(':not(.disabled, .not-selectable)')[e.keyCode == 36 ? 'first' : 'last']()
                            .trigger('contextmenu:focus');
                        e.preventDefault();
                        return;
                    }
                    break;
                    
                case 13: // enter
                    handle.keyStop(e, opt);
                    if (opt.isInput) {
                        if (opt.$selected && !opt.$selected.is('textarea, select')) {
                            e.preventDefault();
                            return;
                        }
                        break;
                    }
                    opt.$selected && opt.$selected.trigger('mouseup');
                    return;
                    
                case 32: // space
                case 33: // page up
                case 34: // page down
                    // prevent browser from scrolling down while menu is visible
                    handle.keyStop(e, opt);
                    return;
                    
                case 27: // esc
                    handle.keyStop(e, opt);
                    opt.$menu.trigger('contextmenu:hide');
                    return;
                    
                default: // 0-9, a-z
                    var k = (String.fromCharCode(e.keyCode)).toUpperCase();
                    if (opt.accesskeys[k]) {
                        // according to the specs accesskeys must be invoked immediately
                        opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu
                            ? 'contextmenu:focus'
                            : 'mouseup'
                        );
                        return;
                    }
                    break;
            }
            // pass event to selected item, 
            // stop propagation to avoid endless recursion
            e.stopPropagation();
            opt.$selected && opt.$selected.trigger(e);
        },

        // select previous possible command in menu
        prevItem: function(e) {
            e.stopPropagation();
            var opt = $(this).data('contextMenu') || {};

            // obtain currently selected menu
            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('contextMenu') || {};
                opt.$selected = $s;
            }
            
            var $children = opt.$menu.children(),
                $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
                $round = $prev;
            
            // skip disabled
            while ($prev.hasClass('disabled') || $prev.hasClass('not-selectable')) {
                if ($prev.prev().length) {
                    $prev = $prev.prev();
                } else {
                    $prev = $children.last();
                }
                if ($prev.is($round)) {
                    // break endless loop
                    return;
                }
            }
            
            // leave current
            if (opt.$selected) {
                handle.itemMouseleave.call(opt.$selected.get(0), e);
            }
            
            // activate next
            handle.itemMouseenter.call($prev.get(0), e);
            
            // focus input
            var $input = $prev.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        },
        // select next possible command in menu
        nextItem: function(e) {
            e.stopPropagation();
            var opt = $(this).data('contextMenu') || {};

            // obtain currently selected menu
            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('contextMenu') || {};
                opt.$selected = $s;
            }

            var $children = opt.$menu.children(),
                $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
                $round = $next;

            // skip disabled
            while ($next.hasClass('disabled') || $next.hasClass('not-selectable')) {
                if ($next.next().length) {
                    $next = $next.next();
                } else {
                    $next = $children.first();
                }
                if ($next.is($round)) {
                    // break endless loop
                    return;
                }
            }
            
            // leave current
            if (opt.$selected) {
                handle.itemMouseleave.call(opt.$selected.get(0), e);
            }
            
            // activate next
            handle.itemMouseenter.call($next.get(0), e);
            
            // focus input
            var $input = $next.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        },
        
        // flag that we're inside an input so the key handler can act accordingly
        focusInput: function(e) {
            var $this = $(this).closest('.context-menu-item'),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            root.$selected = opt.$selected = $this;
            root.isInput = opt.isInput = true;
        },
        // flag that we're inside an input so the key handler can act accordingly
        blurInput: function(e) {
            var $this = $(this).closest('.context-menu-item'),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            root.isInput = opt.isInput = false;
        },
        
        // :hover on menu
        menuMouseenter: function(e) {
            var root = $(this).data().contextMenuRoot;
            root.hovering = true;
        },
        // :hover on menu
        menuMouseleave: function(e) {
            var root = $(this).data().contextMenuRoot;
            if (root.$layer && root.$layer.is(e.relatedTarget)) {
                root.hovering = false;
            }
        },
        
        // :hover done manually so key handling is possible
        itemMouseenter: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;
            
            root.hovering = true;

            // abort if we're re-entering
            if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }

            // make sure only one item is selected
            (opt.$menu ? opt : root).$menu
                .children('.hover').trigger('contextmenu:blur');

            if ($this.hasClass('disabled') || $this.hasClass('not-selectable')) {
                opt.$selected = null;
                return;
            }
            
            $this.trigger('contextmenu:focus');
        },
        // :hover done manually so key handling is possible
        itemMouseleave: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                root.$selected && root.$selected.trigger('contextmenu:blur');
                e.preventDefault();
                e.stopImmediatePropagation();
                root.$selected = opt.$selected = opt.$node;
                return;
            }
            
            $this.trigger('contextmenu:blur');
        },
        // contextMenu item click
        itemClick: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot,
                key = data.contextMenuKey,
                callback;

            // abort if the key is unknown or disabled or is a menu
            if (!opt.items[key] || $this.is('.disabled, .context-menu-submenu, .context-menu-separator, .not-selectable')) {
                return;
            }

            e.preventDefault();
            e.stopImmediatePropagation();

            if ($.isFunction(root.callbacks[key]) && Object.prototype.hasOwnProperty.call(root.callbacks, key)) {
                // item-specific callback
                callback = root.callbacks[key];
            } else if ($.isFunction(root.callback)) {
                // default callback
                callback = root.callback;                
            } else {
                // no callback, no action
                return;
            }

            // hide menu if callback doesn't stop that
            if (callback.call(root.$trigger, key, root) !== false) {
                root.$menu.trigger('contextmenu:hide');
            } else if (root.$menu.parent().length) {
                op.update.call(root.$trigger, root);
            }
        },
        // ignore click events on input elements
        inputClick: function(e) {
            e.stopImmediatePropagation();
        },
        
        // hide <menu>
        hideMenu: function(e, data) {
            var root = $(this).data('contextMenuRoot');
            op.hide.call(root.$trigger, root, data && data.force);
        },
        // focus <command>
        focusItem: function(e) {
            e.stopPropagation();
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            $this.addClass('hover')
                .siblings('.hover').trigger('contextmenu:blur');
            
            // remember selected
            opt.$selected = root.$selected = $this;
            
            // position sub-menu - do after show so dumb $.ui.position can keep up
            if (opt.$node) {
                root.positionSubmenu.call(opt.$node, opt.$menu);
            }
        },
        // blur <command>
        blurItem: function(e) {
            e.stopPropagation();
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;
            
            $this.removeClass('hover');
            opt.$selected = null;
        }
    },
    // operations
    op = {
        show: function(opt, x, y) {
            var $trigger = $(this),
                offset,
                css = {};

            // hide any open menus
            $('#context-menu-layer').trigger('mousedown');

            // backreference for callbacks
            opt.$trigger = $trigger;

            // show event
            if (opt.events.show.call($trigger, opt) === false) {
                $currentTrigger = null;
                return;
            }

            // create or update context menu
            op.update.call($trigger, opt);
            
            // position menu
            opt.position.call($trigger, opt, x, y);

            // make sure we're in front
            if (opt.zIndex) {
                css.zIndex = zindex($trigger) + opt.zIndex;
            }
            
            // add layer
            op.layer.call(opt.$menu, opt, css.zIndex);
            
            // adjust sub-menu zIndexes
            opt.$menu.find('ul').css('zIndex', css.zIndex + 1);
            
            // position and show context menu
            opt.$menu.css( css )[opt.animation.show](opt.animation.duration, function() {
                $trigger.trigger('contextmenu:visible');
            });
            // make options available and set state
            $trigger
                .data('contextMenu', opt)
                .addClass("context-menu-active");
            
            // register key handler
            $(document).off('keydown.contextMenu').on('keydown.contextMenu', handle.key);
            // register autoHide handler
            if (opt.autoHide) {
                // mouse position handler
                $(document).on('mousemove.contextMenuAutoHide', function(e) {
                    // need to capture the offset on mousemove,
                    // since the page might've been scrolled since activation
                    var pos = $trigger.offset();
                    pos.right = pos.left + $trigger.outerWidth();
                    pos.bottom = pos.top + $trigger.outerHeight();
                    
                    if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                        // if mouse in menu...
                        opt.$menu.trigger('contextmenu:hide');
                    }
                });
            }
        },
        hide: function(opt, force) {
            var $trigger = $(this);
            if (!opt) {
                opt = $trigger.data('contextMenu') || {};
            }
            
            // hide event
            if (!force && opt.events && opt.events.hide.call($trigger, opt) === false) {
                return;
            }
            
            // remove options and revert state
            $trigger
                .removeData('contextMenu')
                .removeClass("context-menu-active");
            
            if (opt.$layer) {
                // keep layer for a bit so the contextmenu event can be aborted properly by opera
                setTimeout((function($layer) {
                    return function(){
                        $layer.remove();
                    };
                })(opt.$layer), 10);
                
                try {
                    delete opt.$layer;
                } catch(e) {
                    opt.$layer = null;
                }
            }
            
            // remove handle
            $currentTrigger = null;
            // remove selected
            opt.$menu.find('.hover').trigger('contextmenu:blur');
            opt.$selected = null;
            // unregister key and mouse handlers
            //$(document).off('.contextMenuAutoHide keydown.contextMenu'); // http://bugs.jquery.com/ticket/10705
            $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
            // hide menu
            opt.$menu && opt.$menu[opt.animation.hide](opt.animation.duration, function (){
                // tear down dynamically built menu after animation is completed.
                if (opt.build) {
                    opt.$menu.remove();
                    $.each(opt, function(key, value) {
                        switch (key) {
                            case 'ns':
                            case 'selector':
                            case 'build':
                            case 'trigger':
                                return true;

                            default:
                                opt[key] = undefined;
                                try {
                                    delete opt[key];
                                } catch (e) {}
                                return true;
                        }
                    });
                }
                
                setTimeout(function() {
                    $trigger.trigger('contextmenu:hidden');
                }, 10);
            });
        },
        create: function(opt, root) {
            if (root === undefined) {
                root = opt;
            }
            // create contextMenu
            opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || "").data({
                'contextMenu': opt,
                'contextMenuRoot': root
            });
            
            $.each(['callbacks', 'commands', 'inputs'], function(i,k){
                opt[k] = {};
                if (!root[k]) {
                    root[k] = {};
                }
            });
            
            root.accesskeys || (root.accesskeys = {});
            
            // create contextMenu items
            $.each(opt.items, function(key, item){
                var $t = $('<li class="context-menu-item"></li>').addClass(item.className || ""),
                    $label = null,
                    $input = null;
                
                // iOS needs to see a click-event bound to an element to actually
                // have the TouchEvents infrastructure trigger the click event
                $t.on('click', $.noop);
                
                item.$node = $t.data({
                    'contextMenu': opt,
                    'contextMenuRoot': root,
                    'contextMenuKey': key
                });
                
                // register accesskey
                // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
                if (item.accesskey) {
                    var aks = splitAccesskey(item.accesskey);
                    for (var i=0, ak; ak = aks[i]; i++) {
                        if (!root.accesskeys[ak]) {
                            root.accesskeys[ak] = item;
                            item._name = item.name.replace(new RegExp('(' + ak + ')', 'i'), '<span class="context-menu-accesskey">$1</span>');
                            break;
                        }
                    }
                }
                
                if (typeof item == "string") {
                    $t.addClass('context-menu-separator not-selectable');
                } else if (item.type && types[item.type]) {
                    // run custom type handler
                    types[item.type].call($t, item, opt, root);
                    // register commands
                    $.each([opt, root], function(i,k){
                        k.commands[key] = item;
                        if ($.isFunction(item.callback)) {
                            k.callbacks[key] = item.callback;
                        }
                    });
                } else {
                    // add label for input
                    if (item.type == 'html') {
                        $t.addClass('context-menu-html not-selectable');
                    } else if (item.type) {
                        $label = $('<label></label>').appendTo($t);
                        $('<span></span>').html(item._name || item.name).appendTo($label);
                        $t.addClass('context-menu-input');
                        opt.hasTypes = true;
                        $.each([opt, root], function(i,k){
                            k.commands[key] = item;
                            k.inputs[key] = item;
                        });
                    } else if (item.items) {
                        item.type = 'sub';
                    }
                
                    switch (item.type) {
                        case 'text':
                            $input = $('<input type="text" value="1" name="" value="">')
                                .attr('name', 'context-menu-input-' + key)
                                .val(item.value || "")
                                .appendTo($label);
                            break;
                    
                        case 'textarea':
                            $input = $('<textarea name=""></textarea>')
                                .attr('name', 'context-menu-input-' + key)
                                .val(item.value || "")
                                .appendTo($label);

                            if (item.height) {
                                $input.height(item.height);
                            }
                            break;

                        case 'checkbox':
                            $input = $('<input type="checkbox" value="1" name="" value="">')
                                .attr('name', 'context-menu-input-' + key)
                                .val(item.value || "")
                                .prop("checked", !!item.selected)
                                .prependTo($label);
                            break;

                        case 'radio':
                            $input = $('<input type="radio" value="1" name="" value="">')
                                .attr('name', 'context-menu-input-' + item.radio)
                                .val(item.value || "")
                                .prop("checked", !!item.selected)
                                .prependTo($label);
                            break;
                    
                        case 'select':
                            $input = $('<select name="">')
                                .attr('name', 'context-menu-input-' + key)
                                .appendTo($label);
                            if (item.options) {
                                $.each(item.options, function(value, text) {
                                    $('<option></option>').val(value).text(text).appendTo($input);
                                });
                                $input.val(item.selected);
                            }
                            break;
                        
                        case 'sub':
                            // FIXME: shouldn't this .html() be a .text()?
                            $('<span></span>').html(item._name || item.name).appendTo($t);
                            item.appendTo = item.$node;
                            op.create(item, root);
                            $t.data('contextMenu', item).addClass('context-menu-submenu');
                            item.callback = null;
                            break;
                        
                        case 'html':
                            $(item.html).appendTo($t);
                            break;
                        
                        default:
                            $.each([opt, root], function(i,k){
                                k.commands[key] = item;
                                if ($.isFunction(item.callback)) {
                                    k.callbacks[key] = item.callback;
                                }
                            });
                            // FIXME: shouldn't this .html() be a .text()?
                            $('<span></span>').html(item._name || item.name || "").appendTo($t);
                            break;
                    }
                    
                    // disable key listener in <input>
                    if (item.type && item.type != 'sub' && item.type != 'html') {
                        $input
                            .on('focus', handle.focusInput)
                            .on('blur', handle.blurInput);
                        
                        if (item.events) {
                            $input.on(item.events, opt);
                        }
                    }
                
                    // add icons
                    if (item.icon) {
                        $t.addClass("icon icon-" + item.icon);
                    }
                }
                
                // cache contained elements
                item.$input = $input;
                item.$label = $label;

                // attach item to menu
                $t.appendTo(opt.$menu);
                
                // Disable text selection
                if (!opt.hasTypes && $.support.eventSelectstart) {
                    // browsers support user-select: none, 
                    // IE has a special event for text-selection
                    // browsers supporting neither will not be preventing text-selection
                    $t.on('selectstart.disableTextSelect', handle.abortevent);
                }
            });
            // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
            if (!opt.$node) {
                opt.$menu.css('display', 'none').addClass('context-menu-root');
            }
            opt.$menu.appendTo(opt.appendTo || document.body);
        },
        resize: function($menu, nested) {
            // determine widths of submenus, as CSS won't grow them automatically
            // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
            // kinda sucks hard...

            // determine width of absolutely positioned element
            $menu.css({position: 'absolute', display: 'block'});
            // don't apply yet, because that would break nested elements' widths
            // add a pixel to circumvent word-break issue in IE9 - #80
            $menu.data('width', Math.ceil($menu.width()) + 1);
            // reset styles so they allow nested elements to grow/shrink naturally
            $menu.css({
                position: 'static',
                minWidth: '0px',
                maxWidth: '100000px'
            });
            // identify width of nested menus
            $menu.find('> li > ul').each(function() {
                op.resize($(this), true);
            });
            // reset and apply changes in the end because nested
            // elements' widths wouldn't be calculatable otherwise
            if (!nested) {
                $menu.find('ul').andSelf().css({
                    position: '', 
                    display: '',
                    minWidth: '',
                    maxWidth: ''
                }).width(function() {
                    return $(this).data('width');
                });
            }
        },
        update: function(opt, root) {
            var $trigger = this;
            if (root === undefined) {
                root = opt;
                op.resize(opt.$menu);
            }
            // re-check disabled for each item
            opt.$menu.children().each(function(){
                var $item = $(this),
                    key = $item.data('contextMenuKey'),
                    item = opt.items[key],
                    disabled = ($.isFunction(item.disabled) && item.disabled.call($trigger, key, root)) || item.disabled === true;

                // dis- / enable item
                $item[disabled ? 'addClass' : 'removeClass']('disabled');
                
                if (item.type) {
                    // dis- / enable input elements
                    $item.find('input, select, textarea').prop('disabled', disabled);
                    
                    // update input states
                    switch (item.type) {
                        case 'text':
                        case 'textarea':
                            item.$input.val(item.value || "");
                            break;
                            
                        case 'checkbox':
                        case 'radio':
                            item.$input.val(item.value || "").prop('checked', !!item.selected);
                            break;
                            
                        case 'select':
                            item.$input.val(item.selected || "");
                            break;
                    }
                }
                
                if (item.$menu) {
                    // update sub-menu
                    op.update.call($trigger, item, root);
                }
            });
        },
        layer: function(opt, zIndex) {
            // add transparent layer for click area
            // filter and background for Internet Explorer, Issue #23
            var $layer = opt.$layer = $('<div id="context-menu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>')
                .css({height: $win.height(), width: $win.width(), display: 'block'})
                .data('contextMenuRoot', opt)
                .insertBefore(this)
                .on('contextmenu', handle.abortevent)
                .on('mousedown', handle.layerClick);
            
            // IE6 doesn't know position:fixed;
            if (!$.support.fixedPosition) {
                $layer.css({
                    'position' : 'absolute',
                    'height' : $(document).height()
                });
            }
            
            return $layer;
        }
    };

// split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
function splitAccesskey(val) {
    var t = val.split(/\s+/),
        keys = [];
        
    for (var i=0, k; k = t[i]; i++) {
        k = k[0].toUpperCase(); // first character only
        // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
        // a map to look up already used access keys would be nice
        keys.push(k);
    }
    
    return keys;
}

// handle contextMenu triggers
$.fn.contextMenu = function(operation) {
    if (operation === undefined) {
        this.first().trigger('contextmenu');
    } else if (operation.x && operation.y) {
        this.first().trigger($.Event("contextmenu", {pageX: operation.x, pageY: operation.y}));
    } else if (operation === "hide") {
        var $menu = this.data('contextMenu').$menu;
        $menu && $menu.trigger('contextmenu:hide');
    } else if (operation === "destroy") {
        $.contextMenu("destroy", {context: this});
    } else if ($.isPlainObject(operation)) {
        operation.context = this;
        $.contextMenu("create", operation);
    } else if (operation) {
        this.removeClass('context-menu-disabled');
    } else if (!operation) {
        this.addClass('context-menu-disabled');
    }
    
    return this;
};

// manage contextMenu instances
$.contextMenu = function(operation, options) {
    if (typeof operation != 'string') {
        options = operation;
        operation = 'create';
    }
    
    if (typeof options == 'string') {
        options = {selector: options};
    } else if (options === undefined) {
        options = {};
    }
    
    // merge with default options
    var o = $.extend(true, {}, defaults, options || {});
    var $document = $(document);
    var $context = $document;
    var _hasContext = false;
    
    if (!o.context || !o.context.length) {
        o.context = document;
    } else {
        // you never know what they throw at you...
        $context = $(o.context).first();
        o.context = $context.get(0);
        _hasContext = o.context !== document;
    }
    
    switch (operation) {
        case 'create':
            // no selector no joy
            if (!o.selector) {
                throw new Error('No selector specified');
            }
            // make sure internal classes are not bound to
            if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
                throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
            }
            if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
                throw new Error('No Items specified');
            }
            counter ++;
            o.ns = '.contextMenu' + counter;
            if (!_hasContext) {
                namespaces[o.selector] = o.ns;
            }
            menus[o.ns] = o;
            
            // default to right click
            if (!o.trigger) {
                o.trigger = 'right';
            }
            
            if (!initialized) {
                // make sure item click is registered first
                $document
                    .on({
                        'contextmenu:hide.contextMenu': handle.hideMenu,
                        'prevcommand.contextMenu': handle.prevItem,
                        'nextcommand.contextMenu': handle.nextItem,
                        'contextmenu.contextMenu': handle.abortevent,
                        'mouseenter.contextMenu': handle.menuMouseenter,
                        'mouseleave.contextMenu': handle.menuMouseleave
                    }, '.context-menu-list')
                    .on('mouseup.contextMenu', '.context-menu-input', handle.inputClick)
                    .on({
                        'mouseup.contextMenu': handle.itemClick,
                        'contextmenu:focus.contextMenu': handle.focusItem,
                        'contextmenu:blur.contextMenu': handle.blurItem,
                        'contextmenu.contextMenu': handle.abortevent,
                        'mouseenter.contextMenu': handle.itemMouseenter,
                        'mouseleave.contextMenu': handle.itemMouseleave
                    }, '.context-menu-item');

                initialized = true;
            }
            
            // engage native contextmenu event
            $context
                .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);
            
            if (_hasContext) {
                // add remove hook, just in case
                $context.on('remove' + o.ns, function() {
                    $(this).contextMenu("destroy");
                });
            }
            
            switch (o.trigger) {
                case 'hover':
                        $context
                            .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                            .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);                    
                    break;
                    
                case 'left':
                        $context.on('click' + o.ns, o.selector, o, handle.click);
                    break;
                /*
                default:
                    // http://www.quirksmode.org/dom/events/contextmenu.html
                    $document
                        .on('mousedown' + o.ns, o.selector, o, handle.mousedown)
                        .on('mouseup' + o.ns, o.selector, o, handle.mouseup);
                    break;
                */
            }
            
            // create menu
            if (!o.build) {
                op.create(o);
            }
            break;
        
        case 'destroy':
            var $visibleMenu;
            if (_hasContext) {
                // get proper options 
                var context = o.context;
                $.each(menus, function(ns, o) {
                    if (o.context !== context) {
                        return true;
                    }
                    
                    $visibleMenu = $('.context-menu-list').filter(':visible');
                    if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                        $visibleMenu.trigger('contextmenu:hide', {force: true});
                    }

                    try {
                        if (menus[o.ns].$menu) {
                            menus[o.ns].$menu.remove();
                        }

                        delete menus[o.ns];
                    } catch(e) {
                        menus[o.ns] = null;
                    }

                    $(o.context).off(o.ns);
                    
                    return true;
                });
            } else if (!o.selector) {
                $document.off('.contextMenu .contextMenuAutoHide');
                $.each(menus, function(ns, o) {
                    $(o.context).off(o.ns);
                });
                
                namespaces = {};
                menus = {};
                counter = 0;
                initialized = false;
                
                $('#context-menu-layer, .context-menu-list').remove();
            } else if (namespaces[o.selector]) {
                $visibleMenu = $('.context-menu-list').filter(':visible');
                if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(o.selector)) {
                    $visibleMenu.trigger('contextmenu:hide', {force: true});
                }
                
                try {
                    if (menus[namespaces[o.selector]].$menu) {
                        menus[namespaces[o.selector]].$menu.remove();
                    }
                    
                    delete menus[namespaces[o.selector]];
                } catch(e) {
                    menus[namespaces[o.selector]] = null;
                }
                
                $document.off(namespaces[o.selector]);
            }
            break;
        
        case 'html5':
            // if <command> or <menuitem> are not handled by the browser,
            // or options was a bool true,
            // initialize $.contextMenu for them
            if ((!$.support.htmlCommand && !$.support.htmlMenuitem) || (typeof options == "boolean" && options)) {
                $('menu[type="context"]').each(function() {
                    if (this.id) {
                        $.contextMenu({
                            selector: '[contextmenu=' + this.id +']',
                            items: $.contextMenu.fromMenu(this)
                        });
                    }
                }).css('display', 'none');
            }
            break;
        
        default:
            throw new Error('Unknown operation "' + operation + '"');
    }
    
    return this;
};

// import values into <input> commands
$.contextMenu.setInputValues = function(opt, data) {
    if (data === undefined) {
        data = {};
    }
    
    $.each(opt.inputs, function(key, item) {
        switch (item.type) {
            case 'text':
            case 'textarea':
                item.value = data[key] || "";
                break;

            case 'checkbox':
                item.selected = data[key] ? true : false;
                break;
                
            case 'radio':
                item.selected = (data[item.radio] || "") == item.value ? true : false;
                break;
            
            case 'select':
                item.selected = data[key] || "";
                break;
        }
    });
};

// export values from <input> commands
$.contextMenu.getInputValues = function(opt, data) {
    if (data === undefined) {
        data = {};
    }
    
    $.each(opt.inputs, function(key, item) {
        switch (item.type) {
            case 'text':
            case 'textarea':
            case 'select':
                data[key] = item.$input.val();
                break;

            case 'checkbox':
                data[key] = item.$input.prop('checked');
                break;
                
            case 'radio':
                if (item.$input.prop('checked')) {
                    data[item.radio] = item.value;
                }
                break;
        }
    });
    
    return data;
};

// find <label for="xyz">
function inputLabel(node) {
    return (node.id && $('label[for="'+ node.id +'"]').val()) || node.name;
}

// convert <menu> to items object
function menuChildren(items, $children, counter) {
    if (!counter) {
        counter = 0;
    }
    
    $children.each(function() {
        var $node = $(this),
            node = this,
            nodeName = this.nodeName.toLowerCase(),
            label,
            item;
        
        // extract <label><input>
        if (nodeName == 'label' && $node.find('input, textarea, select').length) {
            label = $node.text();
            $node = $node.children().first();
            node = $node.get(0);
            nodeName = node.nodeName.toLowerCase();
        }
        
        /*
         * <menu> accepts flow-content as children. that means <embed>, <canvas> and such are valid menu items.
         * Not being the sadistic kind, $.contextMenu only accepts:
         * <command>, <menuitem>, <hr>, <span>, <p> <input [text, radio, checkbox]>, <textarea>, <select> and of course <menu>.
         * Everything else will be imported as an html node, which is not interfaced with contextMenu.
         */
        
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#concept-command
        switch (nodeName) {
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-menu-element
            case 'menu':
                item = {name: $node.attr('label'), items: {}};
                counter = menuChildren(item.items, $node.children(), counter);
                break;
            
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
            case 'a':
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
            case 'button':
                item = {
                    name: $node.text(),
                    disabled: !!$node.attr('disabled'),
                    callback: (function(){ return function(){ $node.click(); }; })()
                };
                break;
            
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-command-element-to-define-a-command

            case 'menuitem':
            case 'command':
                switch ($node.attr('type')) {
                    case undefined:
                    case 'command':
                    case 'menuitem':
                        item = {
                            name: $node.attr('label'),
                            disabled: !!$node.attr('disabled'),
                            callback: (function(){ return function(){ $node.click(); }; })()
                        };
                        break;
                        
                    case 'checkbox':
                        item = {
                            type: 'checkbox',
                            disabled: !!$node.attr('disabled'),
                            name: $node.attr('label'),
                            selected: !!$node.attr('checked')
                        };
                        break;
                        
                    case 'radio':
                        item = {
                            type: 'radio',
                            disabled: !!$node.attr('disabled'),
                            name: $node.attr('label'),
                            radio: $node.attr('radiogroup'),
                            value: $node.attr('id'),
                            selected: !!$node.attr('checked')
                        };
                        break;
                        
                    default:
                        item = undefined;
                }
                break;
 
            case 'hr':
                item = '-------';
                break;
                
            case 'input':
                switch ($node.attr('type')) {
                    case 'text':
                        item = {
                            type: 'text',
                            name: label || inputLabel(node),
                            disabled: !!$node.attr('disabled'),
                            value: $node.val()
                        };
                        break;
                        
                    case 'checkbox':
                        item = {
                            type: 'checkbox',
                            name: label || inputLabel(node),
                            disabled: !!$node.attr('disabled'),
                            selected: !!$node.attr('checked')
                        };
                        break;
                        
                    case 'radio':
                        item = {
                            type: 'radio',
                            name: label || inputLabel(node),
                            disabled: !!$node.attr('disabled'),
                            radio: !!$node.attr('name'),
                            value: $node.val(),
                            selected: !!$node.attr('checked')
                        };
                        break;
                    
                    default:
                        item = undefined;
                        break;
                }
                break;
                
            case 'select':
                item = {
                    type: 'select',
                    name: label || inputLabel(node),
                    disabled: !!$node.attr('disabled'),
                    selected: $node.val(),
                    options: {}
                };
                $node.children().each(function(){
                    item.options[this.value] = $(this).text();
                });
                break;
                
            case 'textarea':
                item = {
                    type: 'textarea',
                    name: label || inputLabel(node),
                    disabled: !!$node.attr('disabled'),
                    value: $node.val()
                };
                break;
            
            case 'label':
                break;
            
            default:
                item = {type: 'html', html: $node.clone(true)};
                break;
        }
        
        if (item) {
            counter++;
            items['key' + counter] = item;
        }
    });
    
    return counter;
}

// convert html5 menu
$.contextMenu.fromMenu = function(element) {
    var $this = $(element),
        items = {};
        
    menuChildren(items, $this.children());
    
    return items;
};

// make defaults accessible
$.contextMenu.defaults = defaults;
$.contextMenu.types = types;
// export internal functions - undocumented, for hacking only!
$.contextMenu.handle = handle;
$.contextMenu.op = op;
$.contextMenu.menus = menus;

})(jQuery);


/*
 * Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 *
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */
(function(factory) {if(typeof define==='function'&&define.amd) {define(['jquery'],factory)}else if(typeof exports==='object') {module.exports=factory}else{factory(jQuery)}}(function($) {var toFix=['wheel','mousewheel','DOMMouseScroll','MozMousePixelScroll'];var toBind='onwheel'in document||document.documentMode>=9?['wheel']:['mousewheel','DomMouseScroll','MozMousePixelScroll'];var lowestDelta,lowestDeltaXY;if($.event.fixHooks) {for(var i=toFix.length;i;) {$.event.fixHooks[toFix[--i]]=$.event.mouseHooks}}$.event.special.mousewheel={setup:function() {if(this.addEventListener) {for(var i=toBind.length;i;) {this.addEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=handler}},teardown:function() {if(this.removeEventListener) {for(var i=toBind.length;i;) {this.removeEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(fn) {return fn?this.bind("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn) {return this.unbind("mousewheel",fn)}});function handler(event) {var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,deltaX=0,deltaY=0,absDelta=0,absDeltaXY=0,fn;event=$.event.fix(orgEvent);event.type="mousewheel";if(orgEvent.wheelDelta) {delta=orgEvent.wheelDelta}if(orgEvent.detail) {delta=orgEvent.detail*-1}if(orgEvent.deltaY) {deltaY=orgEvent.deltaY*-1;delta=deltaY}if(orgEvent.deltaX) {deltaX=orgEvent.deltaX;delta=deltaX*-1}if(orgEvent.wheelDeltaY!==undefined) {deltaY=orgEvent.wheelDeltaY}if(orgEvent.wheelDeltaX!==undefined) {deltaX=orgEvent.wheelDeltaX*-1}absDelta=Math.abs(delta);if(!lowestDelta||absDelta<lowestDelta) {lowestDelta=absDelta}absDeltaXY=Math.max(Math.abs(deltaY),Math.abs(deltaX));if(!lowestDeltaXY||absDeltaXY<lowestDeltaXY) {lowestDeltaXY=absDeltaXY}fn=delta>0?'floor':'ceil';delta=Math[fn](delta/lowestDelta);deltaX=Math[fn](deltaX/lowestDeltaXY);deltaY=Math[fn](deltaY/lowestDeltaXY);args.unshift(event,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args)}}));


// Parse and Format Library
//http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
/*
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, version 2.1.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 */
Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(b){if(b=="unixtime"){return parseInt(this.getTime()/1000);}if(Date.formatFunctions[b]==null){Date.createNewFormat(b);}var a=Date.formatFunctions[b];return this[a]();};Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var code="Date.prototype."+funcName+" = function() {return ";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;code+="'"+String.escape(ch)+"' + ";}else{code+=Date.getFormatCode(ch);}}}eval(code.substring(0,code.length-3)+";}");};Date.getFormatCode=function(a){switch(a){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(a)+"' + ";}};Date.parseDate=function(a,c){if(c=="unixtime"){return new Date(!isNaN(parseInt(a))?parseInt(a)*1000:0);}if(Date.parseFunctions[c]==null){Date.createParser(c);}var b=Date.parseFunctions[c];return Date[b](a);};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input) {\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = -1;\nvar d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes["+regexNum+"]);\nif (results && results.length > 0) {";var regex="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;regex+=String.escape(ch);}else{obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c;}}}}code+="if (y > 0 && z > 0){\nvar doyDate = new Date(y,0);\ndoyDate.setDate(z);\nm = doyDate.getMonth();\nd = doyDate.getDate();\n}";code+="if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{return new Date(y, m, d, h, i, s);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{return new Date(y, m, d, h, i);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0)\n{return new Date(y, m, d, h);}\nelse if (y > 0 && m >= 0 && d > 0)\n{return new Date(y, m, d);}\nelse if (y > 0 && m >= 0)\n{return new Date(y, m);}\nelse if (y > 0)\n{return new Date(y);}\n}return null;}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$");eval(code);};Date.formatCodeToRegex=function(b,a){switch(b){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":case"d":return{g:1,c:"d = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:1,c:"z = parseInt(results["+a+"], 10);\n",s:"(\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"].substring(0, 3)], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"]], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":case"m":return{g:1,c:"m = parseInt(results["+a+"], 10) - 1;\n",s:"(\\d{1,2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+a+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+a+"], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+a+"] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+a+"] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":case"h":case"H":return{g:1,c:"h = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"i":return{g:1,c:"i = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"O":return{g:0,c:null,s:"[+-]\\d{4}"};case"T":return{g:0,c:null,s:"[A-Z]{3}"};case"Z":return{g:0,c:null,s:"[+-]\\d{1,5}"};default:return{g:0,c:null,s:String.escape(b)};}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")+String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset())/60),2,"0")+String.leftPad(Math.abs(this.getTimezoneOffset())%60,2,"0");};Date.prototype.getDayOfYear=function(){var a=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var b=0;b<this.getMonth();++b){a+=Date.daysInMonth[b];}return a+this.getDate();};Date.prototype.getWeekOfYear=function(){var b=this.getDayOfYear()+(4-this.getDay());var a=new Date(this.getFullYear(),0,1);var c=(7-a.getDay()+4);return String.leftPad(Math.ceil((b-c)/7)+1,2,"0");};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return((a&3)==0&&(a%100||(a%400==0&&a)));};Date.prototype.getFirstDayOfMonth=function(){var a=(this.getDay()-(this.getDate()-1))%7;return(a<0)?(a+7):a;};Date.prototype.getLastDayOfMonth=function(){var a=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(a<0)?(a+7):a;};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()];};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};String.escape=function(a){return a.replace(/('|\\)/g,"\\$1");};String.leftPad=function(d,b,c){var a=new String(d);if(c==null){c=" ";}while(a.length<b){a=c+a;}return a;};Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};Date.patterns={ISO8601LongPattern:"Y-m-d H:i:s",ISO8601ShortPattern:"Y-m-d",ShortDatePattern:"n/j/Y",LongDatePattern:"l, F d, Y",FullDateTimePattern:"l, F d, Y g:i:s A",MonthDayPattern:"F d",ShortTimePattern:"g:i A",LongTimePattern:"g:i:s A",SortableDateTimePattern:"Y-m-d\\TH:i:s",UniversalSortableDateTimePattern:"Y-m-d H:i:sO",YearMonthPattern:"F, Y"};

//截取字符串，多余的部分用...代替
export var setString = function(str, len) {
    var str_len = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            str_len += 2;
        } else {
            str_len++;
        }
        s += str.charAt(i);
        if (str_len >= len) {
            return s + "...";
        }
    }
    return s;
};

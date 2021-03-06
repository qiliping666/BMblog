import {system_config} from '../../config.js';
//截取字符串，多余的部分用...代替
export var setString = function (str, len) {
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

//格式化设置
export var option_format = (get_options)=> {
    var options = "{";
    for (var n = 0; n < get_options.length; n++) {
        options = options + "\"" + get_options[n].option_name + "\":\"" + get_options[n].option_value + "\"";
        if (n < get_options.length - 1) {
            options = options + ",";
        }
    }
    return JSON.parse(options + "}");
};

//替换SQL字符串中的前缀
export var sql_format = (str)=> {
    if(system_config.mysql_prefix != "bm_"){
        str.replace(/bm_/g, system_config.mysql_prefix);
    }
};
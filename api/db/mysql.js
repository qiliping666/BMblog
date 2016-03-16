import { system_config } from '../config.js';
import mysql from 'mysql';
import mysql_queues from 'mysql-queues';
import async from 'async';

var connection = mysql.createConnection({
    host: system_config.mysql_host,
    user: system_config.mysql_user,
    password: system_config.mysql_password,
    database: system_config.mysql_database,
    port: system_config.mysql_port
});

export function Connect_DB(){
    connection.connect(function (err) {
        if(err){
            console.log("Error Connected to MySQL! " + err);
        }else{
            console.log("Connected to MySQL!");
        }
    });
}

export function Query(string){
    connection.query(string, function (error, rows, fields) {
        if(error){
            return error;
        }else{
            JSON.stringify(rows);
        }
    });
}


var db_tran = function(){
// 获取事务
    queues(mysql);
    var trans = mysql.startTransaction();

    async.series([
        function(insert_cb) {
            var insert_sql = "INSERT INTO `shop` (`id`, `name`, `address`, `tel`, `fax`, `mail`, `shop_kbn`, `modified_date`, `modified_id`) VALUES ('18', '1212', '1212', '12', '12', '12', '12', '2013-05-28 16:10:15', '0')";
            // 执行第一条sql语句 如果出错 直接进入最后的 错误方法 回滚事务
            trans.query(insert_sql, function(err, info) {
                insert_cb(err, info);
            })

        },
        function(update_cb_1) {
            var update_sql_1 = "UPDATE `shop` SET `address`='管理会社  1' WHERE `id`='17'";

            // 执行第二条sql语句 如果出错 直接进入最后的 错误方法 回滚事务
            trans.query(update_sql_1, function(err, info) {
                update_cb_1(err, info);
            })
        },
        function(update_cb_2) {
            var update_sql_2 = "UPDATE `shop` SET `address`='管理会社  2' WHERE `id`='16'";
            // 执行第三条sql语句 如果出错 直接进入最后的 错误方法 回滚事务
            trans.query(update_sql_2, function(err, info) {
                update_cb_2(err, info);
            })

        }
    ], function(err, results) {
        if (err) {
            console.log("rollback");
            // 出错的场合 回滚
            trans.rollback();
        } else {
            // 没有错误的场合 提交事务
            trans.commit();
        }

    });
// 执行这个事务
    trans.execute();
}


const DEBUG = true;
queues(conn, DEBUG);

var trans = conn.startTransaction();

trans.query("INSERT INTO person(id,name,password,sex,email) VALUES (‘33’, ‘name33’, ‘pass33’, ‘bb’, ‘33@aa.com’)", function(err, info) {
    if (err) {
//throw err;
        trans.rollback();
    } else {
        trans.commit();
    }
});

trans.query("INSERT INTO person(id,name,password,sex,email) VALUES (‘44’, ‘name44’, ‘pass44’, ‘bb’, ‘44@aa.com’)", function(err, info) {
    if (err) {
//throw err;
        trans.rollback();
    } else {
        trans.commit();
    }
});

trans.execute();
console.log('execute');

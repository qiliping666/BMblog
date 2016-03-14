import { system_config } from '../config.js';
import mysql from 'mysql';

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


export var system_config = {
    HTTP_server_type: 'http://', //HTTP服务器地址,包含"http://"或"https://"
    HTTP_server_host: 'localhost',//HTTP服务器地址,请勿添加"http://"
    HTTP_server_port: '3000',//HTTP服务器端口号
    System_type: 'development', //系统状态：开发：'development'   产品：'production'
    mysql_host: 'localhost', //MySQL服务器地址
    mysql_user: 'root', //数据库用户名
    mysql_password: '', //数据库密码
    mysql_database: 'bmblog', //数据库名称
    mysql_port: 3306, //数据库端口号
    mysql_prefix: 'bm_', //默认"bm_"
    country: 'cn', //所在国家的国家代码
    API_Safety: 'true' //设定API服务器的安全性,是否仅允许指定的
};
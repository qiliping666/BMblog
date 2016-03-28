# BMblog

BMblog 是一个极速高效,拓展性强的博客系统.
BMblog is a fast blog framework.

BMblog使用MySQL数据库,前端使用React框架,后端采用REST API service.前后端可实现完全分离式的开发.

Use:
[React](http://facebook.github.io/react/),
[Redux](http://rackt.github.io/redux/),
[React Router](http://rackt.github.io/react-router/),
[Babel](https://babeljs.io/) and
[Webpack](http://webpack.github.io/).

Some features:
- Server-side rendering
- Token-based authorization with [JWT](https://www.npmjs.com/package/jsonwebtoken)
- Markdown editor of posts with [marked](https://www.npmjs.com/package/marked)
- Modular CSS with [React CSS Modules](https://github.com/gajus/react-css-modules)
- API mock with [JSON server](https://www.npmjs.com/package/json-server)

_make.exe是编译BMblog必需的软件，请防止杀毒软件自动删除._
## Running
```bash
sudo npm install
```

### Production
```bash
make
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) in the browser.

### Development
```bash
make dev
```

### Remake
```bash
sudo make
rm -rf public app/server-bundle.js
npm start
```

## Windows系统下安装和部署BMblog
确保已经安装部署npm和github.
###复制BMblog到本地
在命令行中输入
```bash
git clone https://github.com/Beethoven-Mozart/BMblog.git
```
###安装BMblog
将本地BMblog仓库设置为当前目录.
```bash
npm install
```
###启动BMblog
```bash
make
npm start
```
在浏览器中输入[http://localhost:3000/](http://localhost:3000/)并打开，即可进入BMblog.

## 版本更新记录
v0.0.5 alpha 2016年03月19日12:11:23
取消了"postinstall": "make".
# BMblog

BMblog is a fast blog framework.

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

## Running
```bash
npm install
```

### Production
```bash
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) in the browser.

### Development
```bash
make dev
```

### Remake
```bash
rm -rf public app/server-bundle.js
make
npm start
```
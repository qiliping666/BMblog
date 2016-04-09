/* eslint-env node */
import 'babel/polyfill';
import express from 'express';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import React from 'react';
import { Provider } from 'react-redux';
import routes from './routes';
import { createRedux } from './utils/redux';
import { system_config } from './config.js';
import cookieParser from 'cookie-parser';

const env = system_config.System_type || 'development';
const app = express();

app.use(cookieParser());
app.use(express.static('public'));

const templatePath = path.join(__dirname, 'template.html');
const templateSource = fs.readFileSync(templatePath, { encoding: 'utf-8' });
const template = _.template(templateSource);

app.use((req, res, next) => {
  const token = req.cookies.token;
  const store = createRedux({ auth: { token } });

  const html = React.renderToString(
      <Provider store={store}>
        <routes />
      </Provider>
  );
  const initialState = JSON.stringify(store.getState());
  const blog_title = system_config.blog_title;
  res.send(template({ html, initialState, env, blog_title }));
});

app.listen(system_config.HTTP_server_port);
console.log("Now start HTTP server on port " + system_config.HTTP_server_port + " ...");
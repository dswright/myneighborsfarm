import React from 'react';
import ReactDOM from 'react-dom/server';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import App from '../application/components/App2';
import store from '../application/store/store';

export default ({ clientStats }) => (req, res) => {
  // need to hydrate the store with server data still.
  // Do this after implementing some basic apis.
  const app = ReactDOM.renderToString(
    <Provider store={store()}>
      <StaticRouter location={req.url} context={{}}>
        <App />
      </StaticRouter>
    </Provider>
  );

  const chunkNames = flushChunkNames();

  const {
    js, styles, scripts, stylesheets
  } = flushChunks(clientStats, {
    chunkNames
  });

  console.log('PATH', req.path); // eslint-ignore-line
  console.log('DYNAMIC CHUNK NAMES RENDERED', chunkNames); // eslint-ignore-line
  console.log('SCRIPTS SERVED', scripts); // eslint-ignore-line
  console.log('STYLESHEETS SERVED', stylesheets); // eslint-ignore-line

  res.send(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>react-universal-component-boilerplate</title>
          ${styles}
        </head>
        <body>
          <div id="root">${app}</div>
        </body>
        ${js}
      </html>`
  );
};

// NODE_ENV == 'development':
//  fetch server information from live whimsy server, and merge in
//  local agenda and draft information as well as location of
//  websocket and associated session token and the execution
//  environment (development or production).  Also, collect all of the
//  user information into a single object.
// 
// NODE_ENV == 'production':
//   TODO

import devproxy from './devproxy.js';
import { session } from '../websocket.js';
import { Board } from '../svn.js';

export default async function server(request) {

  let server = JSON.parse(await devproxy(request, 'server.json'));

  server.agendas = await Board.agendas(request);
  server.drafts = await Board.draftMinutes(request);

  let wsProtocol = request.secure ? 'wss' : 'ws';

  server.websocket = `${wsProtocol}://${request.get('host')}${request.baseUrl}/websocket`;
  server.session = session;

  server.env = process.env.NODE_ENV;

  let userprops = ['userid', 'username', 'firstname', 'initials', 'role'];

  server.user = {};
  for (let prop of userprops) {
     if (server[prop]) {
       server.user[prop] = server[prop];
       delete server[prop];
     }
  }

  return server;
}

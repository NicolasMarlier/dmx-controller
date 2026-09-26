"use strict";
// import { WebSocketServer, WebSocket } from 'ws';
// import { EnttecOpenDMXUSB } from '../enttec_open_dmx_usb';
// import { MidiRouter } from '../midi_router';
// import { DMX_LOOP_EVENTS, DmxLoop } from '../dmx_loop';
// // HTTP Server
// const express = require('express')
// var cors = require('cors')
// const app = express()
// app.use(express.json());
// app.use(cors())
// const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000
// const WS_PORT = Number(process.env.WS_PORT) || 8080
// // DMXInterface
// const enttec = new EnttecOpenDMXUSB()
// // WS Server
// const wss = new WebSocketServer({
//   port: WS_PORT
// });
// const ws_clients = new Set<WebSocket>();
// const sendStatusToAll = () => {
//   ws_clients.forEach(ws => sendStatus(ws))
// }
// const sendStatus = (ws: WebSocket) => {
//   ws_clients.forEach(ws => ws.send(JSON.stringify({
//     channel: 'dmx',
//     data: {
//       enttecOpenDMXUSB: {
//         state: enttec.state()
//       },
//       dmxHexSignal: enttec.dmxHexString,
//       midiCurrentTick: DmxLoop.getInstance().dmxMidiHandler.currentTick
//     }
//   })))
// }
// const wsSendToAll = (message: string) => {
//   ws_clients.forEach(ws => ws.send(message))
// }
// wss.on('connection', (ws: WebSocket) => {
//   ws.on('error', console.error);
//   ws.on('message', (rawMessage) => {
//     const data = JSON.parse(rawMessage.toString())
//     if(data.channel == 'dmx-midi-control') {
//       const payload = data as DmxMidiControlClientToServerWsPayload
//       DmxLoop.getInstance().dmxMidiHandler.updateCurrentTickManually(payload.data.midiCurrentTick)
//     }
//   });
//   enttec.updateDispatch = () => {
//     sendStatus(ws)
//   }
//   sendStatus(ws)
//   ws_clients.add(ws);
//   ws.on("close", () => {
//     ws_clients.delete(ws);
//   });
// });
// console.log(`WS Server ready on port ${WS_PORT}`)
// //DmxLoop
// DmxLoop.getInstance().on(DMX_LOOP_EVENTS.TICK, (dmx_hex_signal) => {
//   enttec.setDmxHex(dmx_hex_signal)
//   sendStatusToAll()
// });
// DmxLoop.getInstance().on(DMX_LOOP_EVENTS.PROGRAM_CHANGE, (program_id: number) => {
//   wsSendToAll(JSON.stringify({
//       channel: 'control',
//       action: 'change_program',
//       data: {program_id}
//   }))
//   DmxLoop.getInstance().dmxMidiHandler.stop({reset: true})
// });
// DmxLoop.getInstance().on(DMX_LOOP_EVENTS.MOCK_MIDI_INPUT, (midi_note_midi: MidiKey) => {
//   const data: WSMidiNoteOnMessage = {
//     midi: midi_note_midi
//   }
//   wsSendToAll(JSON.stringify({
//       channel: 'midi_input',
//       action: 'note_on',
//       data
//   }))
// })
// DmxLoop.getInstance().start()
//# sourceMappingURL=app.js.map
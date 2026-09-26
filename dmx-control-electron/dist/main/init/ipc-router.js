"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const electron_1 = require("electron");
const programs_controller_1 = require("../controllers/programs.controller");
const programs_audio_controller_1 = require("../controllers/programs_audio.controller");
const dmx_midi_controller_1 = require("../controllers/dmx_midi.controller");
const dmx_buttons_controller_1 = require("../controllers/dmx_buttons.controller");
function handle(channel, fn) {
    electron_1.ipcMain.handle(channel, async (event, ...args) => {
        // Middleware possible ici : log, vérification de event.senderFrame.url, etc.
        return fn(...args);
    });
}
// L'équivalent de app.get / app.post
handle('programs:list', programs_controller_1.ProgramsController.list);
handle('programs:create', programs_controller_1.ProgramsController.create);
handle('programs:update', programs_controller_1.ProgramsController.update);
handle('programs:destroy', programs_controller_1.ProgramsController.destroy);
handle('programs:select', programs_controller_1.ProgramsController.select);
handle('programs:audio:upload', programs_audio_controller_1.ProgramsAudioController.upload);
handle('programs:audio:reset', programs_audio_controller_1.ProgramsAudioController.reset);
handle('programs:audio:get', programs_audio_controller_1.ProgramsAudioController.getAudio);
handle('programs:dmx_midi:get', dmx_midi_controller_1.DmxMidiController.get);
handle('programs:dmx_midi:update', dmx_midi_controller_1.DmxMidiController.update);
handle('dmx_buttons:list', dmx_buttons_controller_1.DmxButtonController.list);
handle('dmx_buttons:create', dmx_buttons_controller_1.DmxButtonController.create);
handle('dmx_buttons:get', dmx_buttons_controller_1.DmxButtonController.get);
handle('dmx_buttons:play', dmx_buttons_controller_1.DmxButtonController.play);
handle('dmx_buttons:update', dmx_buttons_controller_1.DmxButtonController.update);
handle('dmx_buttons:destroy', dmx_buttons_controller_1.DmxButtonController.destroy);
//# sourceMappingURL=ipc-router.js.map
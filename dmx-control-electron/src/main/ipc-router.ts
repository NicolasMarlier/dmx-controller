import { ipcMain } from 'electron';
import type { ApiContract, Channel } from '../shared/ipc-contract';
import { ProgramsController } from './controllers/programs.controller';

export function handle<C extends Channel>(
  channel: C,
  fn: (...args: ApiContract[C]['args']) => Promise<ApiContract[C]['result']>,
) {
  ipcMain.handle(channel, async (event, ...args) => {
    // Middleware possible ici : log, vérification de event.senderFrame.url, etc.
    return fn(...(args as ApiContract[C]['args']));
  });
}

// L'équivalent de app.get / app.post
handle('programs:list',   ProgramsController.list);
// handle('programs:create', ProgramsController.create);
// handle('programs:delete', ProgramsController.delete);
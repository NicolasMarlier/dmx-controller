export const listPrograms  = ()                => window.dmxControl.api.invoke('programs:list');
export const createProgram = (name: string)    => window.dmxControl.api.invoke('programs:create', { name });
export const deleteProgram = (id: number)      => window.dmxControl.api.invoke('programs:delete', id);
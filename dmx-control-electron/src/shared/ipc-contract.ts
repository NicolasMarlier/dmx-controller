export interface ApiContract {
  'programs:list':   { args: [];                              result: Program[] };
  'programs:create': { args: [params: { name: string }];      result: Program };
  'programs:update': { args: [id: number, p: Partial<Program>]; result: void };
  'programs:delete': { args: [id: number];                    result: void };
}

export type Channel = keyof ApiContract;
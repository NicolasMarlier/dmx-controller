//import { Request, Response } from "express"
import { Program } from "../sequelize/models/program";
// import { handleErrors, NotFoundError, validateUrlParam } from "./application.controller";
import { DmxMidi } from "../sequelize/models/dmx_midi";
import { handleErrors } from "./application.controller";
//import { DmxLoop } from "../dmx_loop";


// const getProgram = async(req: Request) => {
//   const id = validateUrlParam(req, 'id')
//   const program = await Program.findByPk(id);

//   if (!program) {
//     throw new NotFoundError("Program not found")
//   }
//   return program
// }


export class ProgramsController {

    static async list() {
      const programs = await Program.findAll(
          {order: [['id', 'ASC']]}
      )

      return programs
        // handleErrors(async() => {
            
        // })
    }
      

    // static async create(req: Request, res: Response) {
    //     handleErrors(req, res, async() => {
    //         const program = await Program
    //             .create({name: req.body.name, bpm: req.body.bpm})
    //         await DmxMidi
    //             .create({
    //                 program_id: program.id,
    //                 midi_patterns: []
    //             })
    
    //         return {
    //             status: 'ok',
    //             program: program
    //         }
    //     })
    // }

    // static async select(req: Request, res: Response) {
    //     handleErrors(req, res, async() => {
    //         const program = await getProgram(req)
    //         await DmxLoop.getInstance().switchProgram(program.id)
    //         return {status: 'ok'}
    //     })
    // }

    // static async update(req: Request, res: Response) {
    //     handleErrors(req, res, async() => {
    //         const program = await getProgram(req)
    //         program.update({name: req.body.name, id: req.body.id, bpm: req.body.bpm})
    //         return {status: 'ok'}
    //     })
    // }

    // static async destroy(req: Request, res: Response) {
    //     handleErrors(req, res, async() => {
    //         const program = await getProgram(req)
    //         await program.destroy();
    //         return { success: true }
    //     })
    // }
}
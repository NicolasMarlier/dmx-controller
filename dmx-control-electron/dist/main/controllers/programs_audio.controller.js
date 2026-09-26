"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsAudioController = void 0;
// import multer from "multer"
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const program_1 = require("../sequelize/models/program");
const application_controller_1 = require("./application.controller");
const UPLOADS_DIR = path_1.default.join(__dirname, "../../uploads/audio");
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
//   filename: (req, _file, cb) => {
//     const ext = path.extname(_file.originalname)
//     cb(null, `program_${req.params.id}${ext}`)
//   },
// })
// export const audioUpload = multer({ storage })
const getProgram = async (program_id) => {
    const program = await program_1.Program.findByPk(program_id);
    if (!program)
        throw new application_controller_1.NotFoundError("Program not found");
    return program;
};
const existingAudioPath = (programId) => {
    const candidates = fs_1.default.readdirSync(UPLOADS_DIR).filter(f => f.startsWith(`program_${programId}.`));
    return candidates.length > 0 ? path_1.default.join(UPLOADS_DIR, candidates[0]) : null;
};
class ProgramsAudioController {
    static upload = (program_id) => (0, application_controller_1.handleErrors)(async () => {
        // if (!req.file) {
        //   res.status(400).json({ error: "No file provided" })
        //   return
        // }
        const program = await getProgram(program_id);
        // // Delete any old file with a different extension than the one just saved
        // fs.readdirSync(UPLOADS_DIR)
        //   .filter(f => f.startsWith(`program_${program.id}.`) && f !== req.file!.filename)
        //   .forEach(f => fs.unlinkSync(path.join(UPLOADS_DIR, f)))
        // await program.update({ audio_filename: req.file.originalname })
        return program;
    });
    static reset = async (program_id) => (0, application_controller_1.handleErrors)(async () => {
        const program = await getProgram(program_id);
        const existing = existingAudioPath(program.id);
        if (existing)
            fs_1.default.unlinkSync(existing);
        await program.update({ audio_filename: null });
        return program;
    });
    static getAudio = async (program_id) => (0, application_controller_1.handleErrors)(async () => {
        const program = await getProgram(program_id);
        const filePath = existingAudioPath(program.id);
        if (!filePath)
            throw new application_controller_1.NotFoundError("No audio file for this program");
        // res.sendFile(filePath)
        return filePath;
    });
}
exports.ProgramsAudioController = ProgramsAudioController;
//# sourceMappingURL=programs_audio.controller.js.map
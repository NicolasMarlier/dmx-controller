"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./ProgramSelect.scss");
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
const react_1 = require("react");
const ProgramSelectOption_1 = __importDefault(require("./ProgramSelectOption"));
const ApiClient_1 = require("../../ApiClient");
const KEY_DOWN_ARROW_DOWN = 'ArrowDown';
const KEY_DOWN_ARROW_UP = 'ArrowUp';
const ProgramSelect = () => {
    const { program, programs, syncPrograms, currentProgramId } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const lastProgramId = (0, react_1.useRef)(currentProgramId);
    const [showPicker, setShowPicker] = (0, react_1.useState)(false);
    const [editingProgramId, setEditingProgramId] = (0, react_1.useState)(undefined);
    const createProgramAndSync = async (name) => {
        const newProgram = await (0, ApiClient_1.createProgram)({ name: name || 'Nouveau' });
        await syncPrograms();
        (0, ApiClient_1.selectProgram)(newProgram.id);
    };
    const clickBackground = (e) => {
        if (e.target == e.currentTarget) {
            setShowPicker(false);
        }
    };
    const relativeProgramId = (index) => {
        return programs[Math.max(0, Math.min(programs.findIndex((p) => p.id == currentProgramId) + index, programs.length - 1))].id;
    };
    const handleKeyDown = (e) => {
        if (programs.length == 0) {
            return;
        }
        if (e.code === KEY_DOWN_ARROW_DOWN) {
            (0, ApiClient_1.selectProgram)(relativeProgramId(1));
        }
        else if (e.code === KEY_DOWN_ARROW_UP) {
            (0, ApiClient_1.selectProgram)(relativeProgramId(-1));
        }
    };
    (0, react_1.useEffect)(() => {
        if (!showPicker) {
            setEditingProgramId(undefined);
        }
    }, [showPicker]);
    (0, react_1.useEffect)(() => {
        if (lastProgramId.current != currentProgramId) {
            lastProgramId.current = currentProgramId;
            setShowPicker(false);
        }
    }, [currentProgramId]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [program, programs, currentProgramId]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [program && (0, jsx_runtime_1.jsxs)("div", { className: "current-program", onClick: () => setShowPicker(true), children: [program.id, " | ", program.name] }), !program && (0, jsx_runtime_1.jsx)("div", { className: "current-program  ", onClick: () => setShowPicker(true), children: "Pick a program" }), showPicker && (0, jsx_runtime_1.jsxs)("div", { className: "picker-background", onClick: clickBackground, children: [(0, jsx_runtime_1.jsxs)("div", { className: `picker ${editingProgramId ? 'editing' : 'not-editing'}`, children: [programs.map((p) => (0, jsx_runtime_1.jsx)(ProgramSelectOption_1.default, { program: p, isEditing: editingProgramId == p.id, setEditingProgramId: setEditingProgramId }, p.id)), (0, jsx_runtime_1.jsx)("div", { className: 'picker-option new-program', onClick: () => createProgramAndSync(), children: "Nouveau programme" })] }), (0, jsx_runtime_1.jsx)("div", { className: 'picker-bottom-shadow' })] })] });
};
exports.default = ProgramSelect;
//# sourceMappingURL=ProgramSelect.js.map
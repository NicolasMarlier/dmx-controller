"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ApiClient_1 = require("../../ApiClient");
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
require("./ProgramSelectOption.scss");
const react_1 = require("react");
const ProgramSelectOption = (props) => {
    const { syncPrograms } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const { program, isEditing, setEditingProgramId } = props;
    const [name, setName] = (0, react_1.useState)(program.name);
    const [id, setId] = (0, react_1.useState)(program.id);
    const [bpm, setBpm] = (0, react_1.useState)(program.bpm);
    (0, react_1.useEffect)(() => {
        setName(program.name);
        setId(program.id);
        setBpm(program.bpm);
    }, [program]);
    const updateProgramAndSync = (id, params) => ((0, ApiClient_1.updateProgram)(id, params).then(syncPrograms));
    const deleteProgramAndSync = (id) => (0, ApiClient_1.deleteProgram)(id).then(syncPrograms);
    const onSave = () => {
        setEditingProgramId(undefined);
        updateProgramAndSync(program.id, { id, name, bpm });
    };
    return (0, jsx_runtime_1.jsxs)("div", { className: `picker-option ${isEditing ? 'editing' : ''}`, children: [(0, jsx_runtime_1.jsx)("input", { className: 'id', disabled: !isEditing, type: "number", value: id, onChange: (e) => setId(parseInt(e.target.value, 10)) }), (0, jsx_runtime_1.jsx)("div", { className: "separator" }), (0, jsx_runtime_1.jsx)("input", { className: 'name', disabled: !isEditing, value: name, onChange: (e) => setName(e.target.value) }), (0, jsx_runtime_1.jsx)("div", { className: "separator" }), (0, jsx_runtime_1.jsx)("input", { className: 'bpm', disabled: !isEditing, type: "number", placeholder: "BPM", value: bpm ?? '', onChange: (e) => setBpm(e.target.value ? parseInt(e.target.value, 10) : 60) }), (0, jsx_runtime_1.jsx)("div", { className: "navigate-button", onClick: () => (0, ApiClient_1.selectProgram)(program.id) }), (0, jsx_runtime_1.jsx)("div", { className: "edit-btn btn", onClick: () => setEditingProgramId(program.id), children: "Edit" }), (0, jsx_runtime_1.jsx)("div", { className: "delete-btn btn", onClick: () => deleteProgramAndSync(program.id), children: "Delete" }), (0, jsx_runtime_1.jsx)("div", { className: "save-btn btn", onClick: () => onSave(), children: "Save" }), (0, jsx_runtime_1.jsx)("div", { className: "blur-on-top" })] });
};
exports.default = ProgramSelectOption;
//# sourceMappingURL=ProgramSelectOption.js.map
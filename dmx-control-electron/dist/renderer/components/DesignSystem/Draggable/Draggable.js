"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Draggable.scss");
const react_1 = require("react");
const Draggable = (props) => {
    const { children, onDropFile, className } = props;
    const [isDraggingAudio, setIsDraggingAudio] = (0, react_1.useState)(false);
    const onDragOver = (event) => {
        event.preventDefault();
        setIsDraggingAudio(true);
    };
    const onDragLeave = () => setIsDraggingAudio(false);
    const onDrop = (event) => {
        event.preventDefault();
        setIsDraggingAudio(false);
        const file = event.dataTransfer.files[0];
        if (file && onDropFile)
            onDropFile(file);
    };
    return (0, jsx_runtime_1.jsx)("div", { onDragOver: onDragOver, onDragLeave: onDragLeave, onDrop: onDrop, className: `${className} draggable ${isDraggingAudio ? 'drag-over' : ''}`, children: children });
};
exports.default = Draggable;
//# sourceMappingURL=Draggable.js.map
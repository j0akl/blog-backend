"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreatePost = void 0;
exports.validateCreatePost = (input) => {
    if (input.title.length < 3) {
        return [
            {
                field: "title",
                message: "title must be longer than 3 characters",
            },
        ];
    }
    if (input.title.length > 120) {
        return [
            {
                field: "text",
                message: "title must be shorter than 120 characters",
            },
        ];
    }
    if (input.text.length < 3) {
        return [
            {
                field: "text",
                message: "title must be longer than 3 characters",
            },
        ];
    }
    return null;
};
//# sourceMappingURL=validateCreatePost.js.map
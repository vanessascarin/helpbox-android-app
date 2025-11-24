// Minimal JS shim so Metro's import '../../App' resolves to the project's TypeScript entry.
const mod = require('./App');
module.exports = mod && mod.__esModule ? mod.default : mod;

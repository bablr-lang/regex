/* @macrome
 * @generatedby @macrome/generator-typescript
 * @generatedfrom ./pattern.ts#1648561535139
 * This file is autogenerated. Please do not edit it directly.
 * When editing run `npx macrome watch` then change the file this is generated from.
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});

(exports.parse = (exports.getPatternInternal = (exports.Pattern = void 0)));
var _regex = require("./internal/regex");
var _ast = require("./internal/ast");

const _ = Symbol.for('_');

const getPatternInternal = (pattern) => {
  return pattern[_];
};

exports.getPatternInternal = getPatternInternal;

class Pattern {
  constructor(pattern, flags) {
    let source;
    let _flags;

    if (pattern instanceof Pattern) {
      return pattern;
    } else if (typeof pattern === 'string') {
      source = pattern;
      _flags = flags || '';
    } else {
      ({ source } = pattern);
      _flags = flags !== undefined ? flags : pattern.flags || '';
    }

    const parser = new _ast.Parser();
    parser.parseFlags(_flags); // for validation
    const ast = parser.parsePattern(source);

    const flagsObj = {
      global: _flags.includes('g'),
      ignoreCase: _flags.includes('i'),
      multiline: _flags.includes('m'),
      dotAll: _flags.includes('s'),
      unicode: _flags.includes('u'),
      sticky: _flags.includes('y'),
    };

    this[_] = (0, _regex.buildPatternInternal)(ast, flagsObj);
    this.source = source;
    this.flags = _flags;
    Object.assign(this, flagsObj);
  }
}

exports.Pattern = Pattern;

const parse = (pattern, flags) => {
  return new Pattern(pattern, flags);
};

exports.parse = parse;
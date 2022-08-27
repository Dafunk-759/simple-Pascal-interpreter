// console.log("MYLOG:", JSON.stringify(process.env.MYLOG));
const log = (...args) => {
  if (+process.env.MYLOG) {
    console.log(...args);
  }
};

/**
 * Lexer
 */
// const INT = "INT";
const INT_CONST = "INT_CONST";
const REAL_CONST = "REAL_CONST";

const PLUS = "PLUS";
const MINUS = "MINUS";
const MUL = "MUL";
const INT_DIV = "INT_DIV";
const FLOAT_DIV = "FLOAT_DIV";

const EOF = "EOF";
const LPAREN = "LPAREN";
const RPAREN = "RPAREN";
const DOT = "DOT";
const BEGIN = "BEGIN";
const END = "END";
const SEMI = "SEMI";
const ASSIGN = "ASSIGN";
const ID = "ID";

const PROGRAM = "PROGRAM";
const PROCEDURE = "PROCEDURE";
const VAR = "VAR";
const COLON = "COLON";
const COMMA = "COMMA";
const INTEGER = "INTEGER"; //type
const REAL = "REAL"; //type

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  static t = {
    PLUS,
    MINUS,
    MUL,
    EOF,
    LPAREN,
    RPAREN,
    DOT,
    BEGIN,
    END,
    SEMI,
    ASSIGN,
    ID,
    INT_CONST,
    REAL_CONST,
    INT_DIV,
    FLOAT_DIV,
    PROGRAM,
    VAR,
    COLON,
    COMMA,
    INTEGER,
    REAL,
    PROCEDURE,
  };
}

const RESERVED_KEYWORDS = {
  PROGRAM: (l, c) => new Token(PROGRAM, "PROGRAM", l, c),
  PROCEDURE: (l, c) => new Token(PROCEDURE, "PROCEDURE", l, c),
  VAR: (l, c) => new Token(VAR, "VAR", l, c),
  INTEGER: (l, c) => new Token(INTEGER, "INTEGER", l, c),
  REAL: (l, c) => new Token(REAL, "REAL", l, c),
  DIV: (l, c) => new Token(INT_DIV, "DIV", l, c),
  BEGIN: (l, c) => new Token(BEGIN, "BEGIN", l, c),
  END: (l, c) => new Token(END, "END", l, c),
};

const isDigit = (c) => c && c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57;
const isUnderScore = (c) => c === "_";
const isAb = (c) =>
  c &&
  ((c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) || // 'a' - 'z'
    (c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90)); // 'A' - 'Z'
const isAlnum = (c) => c && (isAb(c) || isDigit(c));

class Lexer {
  constructor(code) {
    this.code = code;
    this.line = 1;
    this.pos = 0;
    this.column = 1;
  }

  get char() {
    return this.code[this.pos];
  }

  #advance() {
    if (this.char === "\n") {
      this.line++;
      this.column = 0;
    }
    this.pos++;
    this.column++;
  }

  #error(c) {
    throw new Error(`\
Invalid character: ${JSON.stringify(c)}. \
at line:${this.line} column:${this.column}`);
  }

  #skipWhiteSpace() {
    while (
      this.pos <= this.code.length - 1 &&
      (this.char === " " || this.char === "\t" || this.char === "\n")
    ) {
      this.#advance();
    }
  }

  #skipComment() {
    while (this.char !== "}") {
      this.#advance();
    }
    this.#advance(); // closing '}'
  }

  #peek() {
    return this.code[this.pos + 1];
  }

  #id() {
    let ret = "";
    while (this.char && (isAlnum(this.char) || isUnderScore(this.char))) {
      ret += this.char;
      this.#advance();
    }

    return (
      RESERVED_KEYWORDS[ret.toUpperCase()]?.(this.line, this.column) ||
      new Token(ID, ret, this.line, this.column)
    );
  }

  #getNumber() {
    let num = "";
    while (isDigit(this.char)) {
      num += this.char;
      this.#advance();
    }

    if (this.char === ".") {
      num += this.char;
      this.#advance();
      while (this.char && isDigit(this.char)) {
        num += this.char;
        this.#advance();
      }
      return new Token(REAL_CONST, parseFloat(num), this.line, this.column);
    } else {
      return new Token(INT_CONST, parseInt(num, 10), this.line, this.column);
    }
  }

  getNextToken() {
    this.#skipWhiteSpace();

    if (this.pos > this.code.length - 1) {
      return new Token(EOF, EOF, this.line, this.column);
    }

    let c = this.char;

    if (c === "{") {
      while (this.char === "{") {
        this.#skipComment();
        this.#skipWhiteSpace();
      }
      this.#skipWhiteSpace();
      c = this.char;

      // after skip those, now maybe is end of file
      // otherwise, will throw
      if (c == undefined) {
        return new Token(EOF, EOF, this.line, this.column);
      }
    }

    if (isAb(c) || isUnderScore(c)) {
      return this.#id();
    }

    if (isDigit(c)) {
      return this.#getNumber();
    }

    if (c === "+") {
      this.#advance();
      return new Token(PLUS, "+", this.line, this.column);
    }

    if (c === "-") {
      this.#advance();
      return new Token(MINUS, "-", this.line, this.column);
    }

    if (c === "*") {
      this.#advance();
      return new Token(MUL, "*", this.line, this.column);
    }

    if (c === "(") {
      this.#advance();
      return new Token(LPAREN, "(", this.line, this.column);
    }

    if (c === ")") {
      this.#advance();
      return new Token(RPAREN, ")", this.line, this.column);
    }

    if (c === ".") {
      this.#advance();
      return new Token(DOT, ".", this.line, this.column);
    }

    if (c === ";") {
      this.#advance();
      return new Token(SEMI, ";", this.line, this.column);
    }

    if (c === "/") {
      this.#advance();
      return new Token(FLOAT_DIV, "/", this.line, this.column);
    }

    if (c === ",") {
      this.#advance();
      return new Token(COMMA, ",", this.line, this.column);
    }

    if (c === ":") {
      if (this.#peek() === "=") {
        this.pos += 2;
        return new Token(ASSIGN, ":=", this.line, this.column);
      }
      this.#advance();
      return new Token(COLON, ":", this.line, this.column);
    }

    this.#error(c);
  }
}

/**
 * Parser
 */

class AST {}

class Program extends AST {
  constructor(name, block) {
    super();
    this.name = name;
    this.block = block;
  }
}

class Block extends AST {
  constructor(declarations, compoundStatemen) {
    super();
    this.declarations = declarations;
    this.compoundStatemen = compoundStatemen;
  }
}

class Param extends AST {
  constructor(varNode, typeNode) {
    super();
    this.varNode = varNode;
    this.typeNode = typeNode;
  }
}

class ProcedureDecl extends AST {
  constructor(procName, params, blockNode) {
    super();
    this.procName = procName;
    this.params = params;
    this.blockNode = blockNode;
  }
}

class ProcedureCall extends AST {
  constructor(procName, actualParams, token) {
    super();
    this.procName = procName;
    this.actualParams = actualParams;
    this.token = token;
  }
}

class VarDecl extends AST {
  constructor(varNode, typeNode) {
    super();
    this.varNode = varNode;
    this.typeNode = typeNode;
  }
}

class Type extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class UnaryOp extends AST {
  constructor(op, expr) {
    super();
    this.op = this.token = op;
    this.expr = expr;
  }
}

class BinOp extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class Num extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class Compound extends AST {
  constructor() {
    super();
    this.children = [];
  }
}

class Assign extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class Var extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class NoOp extends AST {}

class Parser {
  constructor(code) {
    this.lexer = new Lexer(code);
    this.currentToken = null;
  }

  #error(expectedType) {
    throw new Error(`Unexpected token: \
expected: ${expectedType}, but got ${this.currentToken.type}. \
at line: ${this.currentToken.line} column: ${this.currentToken.column}
`);
  }

  #eat(type) {
    if (type !== this.currentToken.type) this.#error(type);
    this.currentToken = this.lexer.getNextToken();
  }

  #factor() {
    let t = this.currentToken;
    switch (this.currentToken.type) {
      case INT_CONST:
        this.#eat(INT_CONST);
        return new Num(t);
      case REAL_CONST:
        this.#eat(REAL_CONST);
        return new Num(t);
      case LPAREN:
        this.#eat(LPAREN);
        let node = this.#expr();
        this.#eat(RPAREN);
        return node;
      case PLUS:
        this.#eat(PLUS);
        return new UnaryOp(t, this.#factor());
      case MINUS:
        this.#eat(MINUS);
        return new UnaryOp(t, this.#factor());
      case ID:
        return this.#variable();
    }
  }

  #term() {
    // term :  factor ((MUL | INT_DIV | FLOAT_DIV) factor)*
    let n = this.#factor();

    while (
      this.currentToken.type === MUL ||
      this.currentToken.type === INT_DIV ||
      this.currentToken.type === FLOAT_DIV
    ) {
      let t = this.currentToken;

      if (t.type === MUL) {
        this.#eat(MUL);
        n = new BinOp(n, t, this.#factor());
      } else if (t.type === INT_DIV) {
        this.#eat(INT_DIV);
        n = new BinOp(n, t, this.#factor());
      } else if (t.type === FLOAT_DIV) {
        this.#eat(FLOAT_DIV);
        n = new BinOp(n, t, this.#factor());
      }
    }

    return n;
  }

  #expr() {
    /**
     * expr : term ((PLUS | MINUS) term)*
     * term : factor ((MUL | DIV) factor)*
     * factor : (PLUS|MINUS)factor | INTEGER | LP expr RP
     *
     */
    let n = this.#term();

    while (
      this.currentToken.type === PLUS ||
      this.currentToken.type === MINUS
    ) {
      let t = this.currentToken;
      if (t.type === PLUS) {
        this.#eat(PLUS);
        n = new BinOp(n, t, this.#term());
      } else if (t.type === MINUS) {
        this.#eat(MINUS);
        n = new BinOp(n, t, this.#term());
      }
    }

    return n;
  }

  #variable() {
    let t = this.currentToken;
    this.#eat(ID);
    return new Var(t);
  }

  #assignmentStatement() {
    let varNode = this.#variable();
    let op = this.currentToken;
    this.#eat(ASSIGN);
    let exprNode = this.#expr();
    return new Assign(varNode, op, exprNode);
  }

  #empty() {
    return new NoOp();
  }

  #statement() {
    switch (this.currentToken.type) {
      case BEGIN:
        return this.#compoundStatement();
      case ID:
        if (this.lexer.char === "(") {
          return this.#procCallStatement();
        } else {
          return this.#assignmentStatement();
        }
      default:
        return this.#empty();
    }
  }

  #procCallStatement() {
    let pt = this.currentToken;
    let procName = pt.value;
    this.#eat(ID);
    this.#eat(LPAREN);
    let aps = [];
    if (
      [PLUS, MINUS, INT_CONST, REAL_CONST, LPAREN, ID].some(
        (t) => t === this.currentToken.type
      )
    ) {
      aps.push(this.#expr());
      while (this.currentToken.type === COMMA) {
        this.#eat(COMMA);
        aps.push(this.#expr());
      }
    }
    this.#eat(RPAREN);
    return new ProcedureCall(procName, aps, pt);
  }

  #statementList() {
    let n = new Compound();
    n.children.push(this.#statement());
    while (this.currentToken.type === SEMI) {
      this.#eat(SEMI);
      n.children.push(this.#statement());
    }
    return n;
  }

  #compoundStatement() {
    this.#eat(BEGIN);
    let n = this.#statementList();
    this.#eat(END);
    return n;
  }

  #typeSpec() {
    let t = this.currentToken;
    switch (t.type) {
      case INTEGER:
        this.#eat(INTEGER);
        return new Type(t);
      case REAL:
        this.#eat(REAL);
        return new Type(t);
    }
  }

  #variableDeclaration() {
    let varNodes = [];
    varNodes.push(this.#variable());
    while (this.currentToken.type === COMMA) {
      this.#eat(COMMA);
      varNodes.push(this.#variable());
    }
    this.#eat(COLON);
    let typeNode = this.#typeSpec();
    return varNodes.map((v) => new VarDecl(v, typeNode));
  }

  #formalParam() {
    let ps = [new Var(this.currentToken)];
    this.#eat(ID);
    while (this.currentToken.type === COMMA) {
      this.#eat(COMMA);
      ps.push(new Var(this.currentToken));
      this.#eat(ID);
    }
    this.#eat(COLON);
    let typeNode = this.#typeSpec();
    return ps.map((v) => new Param(v, typeNode));
  }

  #formalParamList() {
    let fps = [];
    if (this.currentToken.type === LPAREN) {
      this.#eat(LPAREN);

      fps.push(...this.#formalParam());
      while (this.currentToken.type === SEMI) {
        this.#eat(SEMI);
        fps.push(...this.#formalParam());
      }

      this.#eat(RPAREN);
    }
    return fps;
  }

  #declarations() {
    if (
      this.currentToken.type === VAR ||
      this.currentToken.type === PROCEDURE
    ) {
      let ds = [];
      while (
        this.currentToken.type === VAR ||
        this.currentToken.type === PROCEDURE
      ) {
        if (this.currentToken.type === VAR) {
          this.#eat(VAR);
          do {
            ds.push(...this.#variableDeclaration());
            this.#eat(SEMI);
          } while (this.currentToken.type === ID);
        } else {
          while (this.currentToken.type === PROCEDURE) {
            this.#eat(PROCEDURE);
            let procName = this.currentToken.value;
            this.#eat(ID);
            let fps = this.#formalParamList();
            this.#eat(SEMI);
            let blockNode = this.#block();
            let pd = new ProcedureDecl(procName, fps, blockNode);
            this.#eat(SEMI);
            ds.push(pd);
          }
        }
      }
      return ds;
    } else {
      return this.#empty();
    }
  }

  #block() {
    return new Block(this.#declarations(), this.#compoundStatement());
  }

  #pragram() {
    this.#eat(PROGRAM);
    let pname = this.currentToken.value;
    this.#eat(ID);
    this.#eat(SEMI);
    let block = this.#block();
    this.#eat(DOT);
    return new Program(pname, block);
  }

  parse() {
    this.currentToken = this.lexer.getNextToken();
    let n = this.#pragram();

    if (this.currentToken.type !== EOF) {
      this.#error(EOF);
    }

    return n;
  }
}

/**
 * Interpreter
 */

class Symbol {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

class BuiltinTypeSymbol extends Symbol {
  constructor(name) {
    super(name);
  }
}

class VarSymbol extends Symbol {
  constructor(name, type) {
    super(name, type);
  }
}

class ProcedureSymbol extends Symbol {
  constructor(name, params = []) {
    super(name);
    this.params = params;
  }
}

class ProgramSymbol extends Symbol {
  constructor(name) {
    super(name);
  }
}

class Scope {
  constructor(scopeName, scopeLevel, enclosingScope) {
    /**
     * symbolName(string) => Symbol
     */
    this.symbols = new Map();
    this.scopeName = scopeName;
    this.scopeLevel = scopeLevel;
    this.enclosingScope = enclosingScope;

    // init builtins only for builtin scope which level is 0
    if (this.scopeLevel === 0) {
      this.define(new BuiltinTypeSymbol(INTEGER));
      this.define(new BuiltinTypeSymbol(REAL));
    }
  }

  define(symbol) {
    log("Define:", symbol);
    this.symbols.set(symbol.name, symbol);
  }

  lookup(name, currentScopeOnly = false) {
    log("lookup:", name);
    let local = this.symbols.get(name);
    if (currentScopeOnly) {
      return local;
    }

    if (local == undefined && this.enclosingScope) {
      return this.enclosingScope.lookup(name);
    }
    return local;
  }
}

class Visitor {
  visit(node) {
    let methodName = "visit" + node.constructor.name;
    if (this[methodName]) {
      return this[methodName](node);
    } else {
      throw new Error("no such method:" + methodName);
    }
  }
}

class SemanticAnalyzer extends Visitor {
  constructor() {
    super();
    this.scope = new Scope("builtin", 0);
  }

  #error(msg, token) {
    throw new Error(`${msg} at line: ${token.line} column: ${token.column}`);
  }

  visitProgram(node) {
    log("ENTER scope: global");
    // globalScope -> undefined
    let pname = node.name;
    this.scope.define(new ProgramSymbol(pname));
    this.scope = new Scope(pname, this.scope.scopeLevel + 1, this.scope);

    this.visit(node.block);

    // restore the parent scope
    this.scope = this.scope.enclosingScope;
    log("LEAVE scope: global");
  }

  visitBlock(node) {
    node.declarations.forEach((d) => {
      this.visit(d);
    });
    this.visit(node.compoundStatemen);
  }

  visitVarDecl(node) {
    let varName = node.varNode.value;
    if (this.scope.lookup(varName, true)) {
      this.#error(
        `Error: Duplicate declaretion VAR:${varName}`,
        node.varNode.token
      );
    }

    let v = new VarSymbol(varName, this.scope.lookup(node.typeNode.value));
    this.scope.define(v);
  }

  visitType(node) {}

  visitUnaryOp(node) {
    this.visit(node.expr);
  }

  visitBinOp(node) {
    this.visit(node.left);
    this.visit(node.right);
  }

  visitNum(node) {}

  visitCompound(node) {
    node.children.forEach((c) => {
      this.visit(c);
    });
  }

  visitAssign(node) {
    this.visit(node.left);
    this.visit(node.right);
  }

  visitVar(node) {
    if (this.scope.lookup(node.value) == undefined) {
      this.#error(`Name Error:${node.value} is undefined`, node.token);
    }
  }

  visitProcedureDecl(node) {
    let procName = node.procName;
    let procSymbol = new ProcedureSymbol(procName);
    this.scope.define(procSymbol);

    // procScope -> parentScope
    log("ENTER scope:", procName);
    this.scope = new Scope(procName, this.scope.scopeLevel + 1, this.scope);

    node.params.forEach((p) => {
      let pt = this.scope.lookup(p.typeNode.value);
      let pn = p.varNode.value;
      let vs = new VarSymbol(pn, pt);
      this.scope.define(vs);
      procSymbol.params.push(vs);
    });

    this.visit(node.blockNode);

    // log(this.scope);
    // restore parentScope
    this.scope = this.scope.enclosingScope;
    // log(this.scope);
    log("LEAVE scope:", procName);
  }

  visitProcedureCall(node) {
    let { procName, actualParams, token } = node;

    let ps = this.scope.lookup(procName);

    if (ps == undefined) {
      this.#error(`Undefined procedure: ${procName}`, token);
    }

    if (ps.params.length !== actualParams.length) {
      this.#error(
        `Procedure params error: ${procName} \
expect ${ps.params.length} but got ${actualParams.length}`,
        token
      );
    }

    node.actualParams.forEach((p) => {
      this.visit(p);
    });
  }

  visitNoOp(node) {}

  build(ast) {
    this.visit(ast);
    return this.scope;
  }
}

class ActivationRecord {
  constructor(name, type, nestingLevel) {
    this.name = name;
    this.type = type; // ActivationRecord.t
    this.nestingLevel = nestingLevel;
    this.member = new Map();
  }

  static t = {
    PROGRAM: "PROGRAM",
  };

  setItem(key, value) {
    this.member.set(key, value);
    return this;
  }

  getItem(key) {
    return this.member.get(key);
  }
}

class CallStack {
  constructor() {
    this.stack = [];
  }

  push(ar) {
    if (ar instanceof ActivationRecord) {
      this.stack.push(ar);
    }
  }

  pop() {
    return this.stack.pop();
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }
}

class Interpreter extends Visitor {
  constructor(code) {
    super();
    this.ast = new Parser(code).parse();
    new SemanticAnalyzer().build(this.ast);
    this.callStack = new CallStack();
  }

  visitBinOp(node) {
    switch (node.op.type) {
      case PLUS:
        return this.visit(node.left) + this.visit(node.right);
      case MINUS:
        return this.visit(node.left) - this.visit(node.right);
      case MUL:
        return this.visit(node.left) * this.visit(node.right);
      case FLOAT_DIV:
        return this.visit(node.left) / this.visit(node.right);
      case INT_DIV:
        return (this.visit(node.left) / this.visit(node.right)) | 0;
    }
    throw node;
  }

  visitNum(node) {
    return node.value;
  }

  visitUnaryOp(node) {
    switch (node.op.type) {
      case PLUS:
        return this.visit(node.expr);
      case MINUS:
        return -this.visit(node.expr);
    }
  }

  visitCompound(node) {
    node.children.forEach((cn) => this.visit(cn));
  }

  visitAssign(node) {
    this.callStack.top.setItem(node.left.value, this.visit(node.right));
  }

  visitVar(node) {
    let varName = node.value;
    let v = this.callStack.top.getItem(varName);
    if (v == undefined) {
      // is null or undefined
      throw new Error(`Name Error:${varName} is undefined.`);
    } else {
      return v;
    }
  }

  visitNoOp(node) {}

  visitProcedureDecl(node) {}

  visitProcedureCall(node) {}

  visitProgram(node) {
    let ar = new ActivationRecord(node.name, ActivationRecord.t.PROGRAM, 1);
    this.callStack.push(ar);
    this.visit(node.block);
    this.callStack.pop();
  }

  visitBlock(node) {
    node.declarations.forEach((d) => this.visit(d));
    return this.visit(node.compoundStatemen);
  }

  visitVarDecl(node) {}

  visitType(node) {}

  eval() {
    return this.visit(this.ast);
  }
}

module.exports = {
  Lexer,
  Token,
  Parser,
  Interpreter,
  SemanticAnalyzer,
};

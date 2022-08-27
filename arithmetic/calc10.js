/**
 * Lexer
 */
const INT = "INT";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const EOF = "EOF";
const LP = "LP";
const RP = "RP";

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Lexer {
  constructor(code) {
    this.code = code;
    this.pos = 0;
  }

  #error() {
    throw new Error("Invalid character.");
  }

  #skipWhiteSpace() {
    while (
      this.pos <= this.code.length - 1 &&
      (this.code[this.pos] === " " || this.code[this.pos] === "\t")
    ) {
      this.pos++;
    }
  }

  getNextToken() {
    this.#skipWhiteSpace();

    if (this.pos > this.code.length - 1) {
      return new Token(EOF);
    }

    let c = this.code[this.pos];

    const isDigit = (c) => c && c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57;
    if (isDigit(c)) {
      let num = "";
      while (isDigit(c)) {
        num += c;
        this.pos++;
        c = this.code[this.pos];
      }
      return new Token(INT, parseInt(num, 10));
    }

    if (c === "+") {
      this.pos++;
      return new Token(PLUS, "+");
    }

    if (c === "-") {
      this.pos++;
      return new Token(MINUS, "-");
    }

    if (c === "*") {
      this.pos++;
      return new Token(MUL, "*");
    }

    if (c === "/") {
      this.pos++;
      return new Token(DIV, "/");
    }

    if (c === "(") {
      this.pos++;
      return new Token(LP, "(");
    }

    if (c === ")") {
      this.pos++;
      return new Token(RP, ")");
    }

    this.#error();
  }
}

/**
 * Parser
 */
class AST {}

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

class Parser {
  constructor(code) {
    this.lexer = new Lexer(code);
    this.currentToken = null;
  }

  #error() {
    throw new Error("Invalid syntax");
  }

  #eat(type) {
    if (type !== this.currentToken.type) this.#error();
    this.currentToken = this.lexer.getNextToken();
  }

  #factor() {
    // factor : (PLUS|MINUS)factor | INTEGER | LP expr RP
    let t = this.currentToken;
    switch (this.currentToken.type) {
      case INT:
        this.#eat(INT);
        return new Num(t);
      case LP:
        this.#eat(LP);
        let node = this.#expr();
        this.#eat(RP);
        return node;
      case PLUS:
        this.#eat(PLUS);
        return new UnaryOp(t, this.#factor());
      case MINUS:
        this.#eat(MINUS);
        return new UnaryOp(t, this.#factor());
    }
  }

  #term() {
    // term : factor ((MUL | DIV) factor)*
    let n = this.#factor();

    while (this.currentToken.type === MUL || this.currentToken.type === DIV) {
      let t = this.currentToken;
      if (t.type === MUL) {
        this.#eat(MUL);
        n = new BinOp(n, t, this.#factor());
      } else if (t.type === DIV) {
        this.#eat(DIV);
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

  expr() {
    this.currentToken = this.lexer.getNextToken();
    return this.#expr();
  }
}

/**
 * Interpreter
 */

class Interpreter {
  constructor(code) {
    this.ast = new Parser(code).expr();
  }

  #visit(node) {
    let methodName = "visit" + node.constructor.name;
    if (this[methodName]) {
      return this[methodName](node);
    } else {
      throw new Error("no such method:" + methodName);
    }
  }

  visitBinOp(node) {
    switch (node.op.type) {
      case PLUS:
        return this.#visit(node.left) + this.#visit(node.right);
      case MINUS:
        return this.#visit(node.left) - this.#visit(node.right);
      case MUL:
        return this.#visit(node.left) * this.#visit(node.right);
      case DIV:
        return this.#visit(node.left) / this.#visit(node.right);
    }
    throw node;
  }

  visitNum(node) {
    return node.value;
  }

  visitUnaryOp(node) {
    switch (node.op.type) {
      case PLUS:
        return this.#visit(node.expr);
      case MINUS:
        return -this.#visit(node.expr);
    }
  }

  eval() {
    return this.#visit(this.ast);
  }
}

module.exports = {
  AST,
  BinOp,
  Num,
  Token,
  INT,
  PLUS,
  MINUS,
  MUL,
  DIV,
  EOF,
  LP,
  RP,
  Parser,
  Interpreter,
};

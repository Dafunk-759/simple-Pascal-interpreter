/* 
a lexer that takes an input and converts it into a stream of tokens

a parser that feeds off the stream of the tokens provided by the lexer
and tries to recognize a structure in that stream, and

an interpreter that generates results after the parser has successfully 
parsed (recognized) a valid arithmetic expression. 
*/

const INT = "INT";
const PLUS = "PLUS";
const MINUS = "MINUS";
const EOF = "EOF";

// type : INT | PLUS | MINUS | EOF

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

    this.#error();
  }
}

class Interpreter {
  constructor(code) {
    this.lexer = new Lexer(code);
    this.currentToken = null;
  }

  #error() {
    throw new Error("Parsing error");
  }

  #eat(type) {
    if (type !== this.currentToken.type) this.#error();
    this.currentToken = this.lexer.getNextToken();
  }

  #factor() {
    let v = this.currentToken.value;
    this.#eat(INT);
    return v;
  }

  #expr() {
    let ret = this.#factor();

    while (
      this.currentToken.type === PLUS ||
      this.currentToken.type === MINUS
    ) {
      let t = this.currentToken;
      if (t.type === PLUS) {
        this.#eat(PLUS);
        ret += this.#factor();
      } else if (t.type === MINUS) {
        this.#eat(MINUS);
        ret -= this.#factor();
      }
    }

    return ret;
  }

  expr() {
    this.currentToken = this.lexer.getNextToken();
    return this.#expr();
  }
}

module.exports = Interpreter;

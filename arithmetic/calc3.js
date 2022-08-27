const INTEGER = "INTEGER";
const MINUS = "MINUS";
const PLUS = "PLUS";
// const MULTIPLE = "MULTIPLE";
// const DIV = "DIV";
const EOF = "EOF";

class Token {
  constructor(type, value) {
    // token type: INTEGER, PLUS, MINUS, EOF
    // token value: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ...
    //  '+', or None
    this.type = type;
    this.value = value;
  }
}

class Interpreter {
  constructor(text) {
    // # client string input, e.g. "3+5"
    this.text = text;
    // # this.pos is an index into this.text
    this.pos = 0;
    // # current token instance
    this.currentToken = null;
  }

  error() {
    throw new Error("Error parsing input");
  }

  // Lexical analyzer (also known as scanner or tokenizer)
  // This method is responsible for breaking a sentence
  // apart into tokens. One token at a time.
  getNextToken() {
    let text = this.text;
    // is this.pos index past the end of the this.text ?
    // if so, then return EOF token because there is no more
    // input left to convert into tokens
    let currentChar = text[this.pos];

    // before getNextToken , skip all white space
    while (currentChar === " " || currentChar === "\t") {
      this.pos++;
      currentChar = text[this.pos];
    }

    // console.log(this.pos, text.length - 1);
    if (this.pos > text.length - 1 || this.text[this.pos] === "\n")
      return new Token(EOF, null);

    // get a character at the position self.pos and decide
    // what token to create based on the single character
    // console.log("text:", JSON.stringify(text));
    // console.log("currentChar:", currentChar);
    // if the character is a digit then convert it to
    // integer, create an INTEGER token, increment self.pos
    // index to point to the next character after the digit,
    // and return the INTEGER token
    // allow 123456
    const isDigit = (c) => /^[0-9]$/.test(c);
    if (isDigit(currentChar)) {
      let num = "";
      while (isDigit(currentChar)) {
        num += currentChar;
        this.pos++;
        currentChar = text[this.pos];
      }
      return new Token(INTEGER, parseInt(num, 10));
    }

    if (currentChar === "+") {
      let token = new Token(PLUS, currentChar);
      this.pos++;
      return token;
    }

    if (currentChar === "-") {
      let token = new Token(MINUS, currentChar);
      this.pos++;
      return token;
    }

    // if (currentChar === "*") {
    //   let token = new Token(MULTIPLE, currentChar);
    //   this.pos++;
    //   return token;
    // }

    // if (currentChar === "/") {
    //   let token = new Token(DIV, currentChar);
    //   this.pos++;
    //   return token;
    // }

    this.error();
  }

  // compare the current token type with the passed token
  // type and if they match then "eat" the current token
  // and assign the next token to the self.current_token,
  // otherwise raise an exception.
  eat(tokenTypes) {
    if (tokenTypes === this.currentToken.type) {
      this.currentToken = this.getNextToken();
    } else {
      this.error();
    }
  }

  term() {
    let t = this.currentToken;
    this.eat(INTEGER);
    return t.value;
  }

  expr() {
    this.currentToken = this.getNextToken();
    let ret = this.term();

    while (
      this.currentToken.type === PLUS ||
      this.currentToken.type === MINUS
    ) {
      if (this.currentToken.type === PLUS) {
        this.eat(PLUS);
        ret += this.term();
      } else if (this.currentToken.type === MINUS) {
        this.eat(MINUS);
        ret -= this.term();
      }
    }

    return ret;
  }
}

module.exports = Interpreter;

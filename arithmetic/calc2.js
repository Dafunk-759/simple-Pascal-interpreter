const INTEGER = "INTEGER";
const MINUS = "MINUS";
const PLUS = "PLUS";
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

    this.error();
  }

  // compare the current token type with the passed token
  // type and if they match then "eat" the current token
  // and assign the next token to the self.current_token,
  // otherwise raise an exception.
  eat(...tokenTypes) {
    if (tokenTypes.some((t) => this.currentToken.type === t)) {
      this.currentToken = this.getNextToken();
    } else {
      this.error();
    }
  }

  expr() {
    // expr ->  INTEGER  [ PLUS | MINUS ]  INTERGER 
    // set current token to the first token taken from the input
    this.currentToken = this.getNextToken();

    // we expect the current token to be a single-digit integer
    let left = this.currentToken;
    this.eat(INTEGER);

    // we expect the current token to be a '+' token
    let op = this.currentToken;
    this.eat(PLUS, MINUS);

    // we expect the current token to be a single-digit integer
    let right = this.currentToken;
    this.eat(INTEGER);

    // after the above call the self.current_token is set to
    // EOF token
    switch (op.type) {
      case PLUS:
        return left.value + right.value;
      case MINUS:
        return left.value - right.value;
      default:
        this.error();
    }
  }
}

module.exports = Interpreter


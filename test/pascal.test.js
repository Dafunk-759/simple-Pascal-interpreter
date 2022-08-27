const pascal = require("../pascal/Pascal");
const assert = require("assert");

describe.only("pascal", () => {
  describe("lexer", () => {
    it("PROGRAM P1", () => {
      let code = `\
PROGRAM P1;
VAR
   a, b       : INTEGER;
   c          : REAL;
BEGIN {Part10}
   BEGIN
      a := 5;
      c := 3.14 / 2
   END
   { b := a div 2; }
   { writeln('a = ', a); }
END.  {Part10}`;
      let l = new pascal.Lexer(code);
      let gnt = l.getNextToken;
      l.getNextToken = function getNextToken() {
        let t = gnt.call(this);
        console.log(`line: ${t.line} column: ${t.column}`);
        t.line = undefined;
        t.column = undefined;
        return t;
      };

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.PROGRAM, "PROGRAM")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ID, "P1")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.SEMI, ";")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.VAR, "VAR")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ID, "a")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.COMMA, ",")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ID, "b")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.COLON, ":")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.INTEGER, "INTEGER")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.SEMI, ";")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ID, "c")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.COLON, ":")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.REAL, "REAL")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.SEMI, ";")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.BEGIN, "BEGIN")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.BEGIN, "BEGIN")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ID, "a")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ASSIGN, ":=")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.INT_CONST, 5)
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.SEMI, ";")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ID, "c")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.ASSIGN, ":=")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.REAL_CONST, 3.14)
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.FLOAT_DIV, "/")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.INT_CONST, 2)
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.END, "END")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.END, "END")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.DOT, ".")
      );

      assert.deepStrictEqual(
        l.getNextToken(),
        new pascal.Token(pascal.Token.t.EOF, pascal.Token.t.EOF)
      );
    });
  });

  describe("parser", () => {
    describe("should not throw", () => {
      it("PROGRAM p; BEGIN a := 2; END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser("PROGRAM p; BEGIN a := 2; END.").parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser("PROGRAM p; BEGIN END.").parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN a := 5; x := 11 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN a := 5; x := 11 END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN a := 5; x := 11; END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN a := 5; x := 11; END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN BEGIN a := 5 END; x := 11 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN BEGIN a := 5 END; x := 11 END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; PROGRAM p; BEGIN a12 := 6;\n bC7 := 8 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN a12 := 6;\n bC7 := 8 END."
          ).parse();
          // console.log(JSON.stringify(ast, null, 2));
        });
      });

      it("PROGRAM p; BEGIN END.  \n\n", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser("PROGRAM p; BEGIN END.  \n\n").parse();
          // console.log(JSON.stringify(ast, null, 2));
        });
      });

      it("PROGRAM p; BEGIN a := 10 * 5 div 2 + 3 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN a := 10 * 5 div 2 + 3 END."
          ).parse();
          // console.log(JSON.stringify(ast, null, 2));
        });
      });

      it("PROGRAM p; BEGIN a := 10 * 5 div 2 + 3; b := a + 1 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN a := 10 * 5 div 2 + 3; b := a + 1 END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN a := 10 * 5 div (2 + 3); b := a + 1 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN a := 10 * 5 div (2 + 3); b := a + 1 END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p2", () => {
        let code = `\
PROGRAM p2; 
BEGIN
  BEGIN
      number := 2;
      a := number;
      b := 10 * a + 10 * number div 4;
      c := a - - b
  END;
    x := 11;
END.`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN beGin ENd; END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN beGin ENd; END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN _number := 10 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN _number := 10 END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM p; BEGIN foo_bar := 10 END.", () => {
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(
            "PROGRAM p; BEGIN foo_bar := 10 END."
          ).parse();
          // console.log(ast);
        });
      });

      it("PROGRAM P3", () => {
        let code = `\
PROGRAM P3;
VAR
   a, b       : INTEGER;
   c          : REAL;
BEGIN {Part10}
   BEGIN
      a := 5;
      c := 3.14 / 2
   END
   { b := a div 2; }
   { writeln('a = ', a); }
END.  {Part10}`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast);
          // console.log(ast.block.declarations);
          // console.log(ast.block.compoundStatemen);
        });
      });

      it("PROGRAM Part12", () => {
        let code = `\
PROGRAM Part12;
VAR
   a : INTEGER;

PROCEDURE P1;
VAR
   a : REAL;
   k : INTEGER;

   PROCEDURE P2;
   VAR
      a, z : INTEGER;
   BEGIN {P2}
      z := 777;
   END;  {P2}

BEGIN {P1}

END;  {P1}

BEGIN {Part12}
   a := 10;
END.  {Part12}`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast);
          // ast.block.declarations.forEach((d) => {
          //   console.log(d);
          // });
        });
      });

      it("PROGRAM Part13", () => {
        let code = `\
PROGRAM Part13;
VAR
number : INTEGER;
a, b : INTEGER;
y : REAL;

PROCEDURE p1;
var x : INTEGER;
begin
x := 1;
end;

VAR
nnn : INTEGER;

PROCEDURE p2;
var x2 : INTEGER;
begin
x2 := 1;
end;

BEGIN {Part11}
number := 2;
a := number ;
b := 10 * a + 10 * number DIV 4;
y := 20 / 7 + 3.14
END. {Part11}`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast);
          // ast.block.declarations.forEach((d) => {
          //   console.log(d);
          // });
        });
      });

      it("PROGRAM Part14", () => {
        let code = `\
PROGRAM Part14;

procedure Foo;
BEGIN
END;

procedure Foo(a : INTEGER);
BEGIN
END;

procedure Foo(a, b : INTEGER);
BEGIN
END;

procedure Foo(a, b : INTEGER; c : REAL);
BEGIN
END;

BEGIN {Part11}
END. {Part11}`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast);
          // ast.block.declarations.forEach((d) => {
          //   console.log(d);
          // });
        });
      });

      it("with procedure call", () => {
        let code = `\
program Main;

procedure Alpha(a : integer; b : integer);
var x : integer;
begin
   x := (a + b ) * 2;
end;

begin { Main }

   Alpha(3 + 5, 7);  { procedure call }

end.  { Main }`;

        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast);
          // ast.block.declarations.forEach((d) => {
          //   console.log(d);
          // });
        });
      });

      it("with if statement 1", () => {
        let code = `\
program Main;
var a, b : integer;

begin { Main }
  a := 1;
  b := 0;
  if (a) begin
    a := 0;
  end else if (b) begin
    b := 1;
  end else begin
    a := 2;
    b := 2;
  end
end.  { Main }`;

        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast);
          // ast.block.declarations.forEach((d) => {
          //   console.log(d);
          // });
        });
      });

      it("with if statement 2", () => {
        let code = `\
program Main;
var a, b : integer;

begin { Main }
  a := 1;
  b := 0;
  if (a) a := 0
  else if (b) b := 1
  else begin
    a := 2;
    b := 2
  end
end.  { Main }`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast.block.compoundStatemen.children)
          // console.log(ast);
          // ast.block.declarations.forEach((d) => {
          //   console.log(d);
          // });
        });
      });

      it("with if statement 3", () => {
        let code = `\
program Main;
var a, b : integer;

begin { Main }
  a := 1;
  if (a) a := 0
  else if (b) b := 1
  else begin
    a := 2;
    b := 2
  end;
  b := 0
end.  { Main }`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast.block.compoundStatemen.children)
          // console.log(ast);
          // ast.block.declarations.forEach((d) => {
          //   console.log(d);
          // });
        });
      });

      it("with if relation expr 1", () => {
        let code = `\
program Main;
var a, b : integer;

begin { Main }
  a := 1;
  if (a > 10) a := 10
  else if (a >= 20) a := 20
  else if (b <= 5) b := 1
  else if (b < 0) b := -1
  else begin
    a := 2;
    b := 2
  end;
  b := 0
end.  { Main }`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          // console.log(ast.block.compoundStatemen.children[1])
          // console.log(ast);
        });
      });

      it("with while statement", () => {
        let code = `\
program Main;
var a, b : integer;

begin { Main }
  a := 1;
  while(a > 10) begin
    while(a < 15) a := a-1
  end;
  b := 0
end.  { Main }`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          console.log(ast.block.compoundStatemen.children[1])
          console.log(ast.block.compoundStatemen.children[1].body.children)
          console.log(ast);
        });
      });
    });

    describe("should throw", () => {
      it("when throw should give position info.", () => {
        let code = `\
PROGRAM P1;
VAR
   a, b       : INTEGER
   c          : REAL;
BEGIN {Part10}
END.  {Part10}`;

        assert.throws(() => {
          try {
            let ast = new pascal.Parser(code).parse();
          } catch (err) {
            console.error(err.message);
            throw err;
          }
        });
      });

      it(".", () => {
        assert.throws(() => {
          let ast = new pascal.Parser(".").parse();
          // console.log(JSON.stringify(ast, null, 2));
        });
      });

      it("BEGIN END.", () => {
        assert.throws(() => {
          let ast = new pascal.Parser("BEGIN END.").parse();
        });
      });

      it("PROGRAM p; BEGIN 12 := 2 END.", () => {
        assert.throws(() => {
          let ast = new pascal.Parser("PROGRAM p; BEGIN 12 := 2 END.").parse();
        });
      });
      it("PROGRAM p; BEGIN", () => {
        assert.throws(() => {
          let ast = new pascal.Parser("PROGRAM p; BEGIN").parse();
        });
      });
      it("PROGRAM p; END", () => {
        assert.throws(() => {
          let ast = new pascal.Parser("PROGRAM p; END").parse();
        });
      });
      it("PROGRAM p; BEGIN END", () => {
        assert.throws(() => {
          let ast = new pascal.Parser("PROGRAM p; BEGIN END").parse();
        });
      });

      it("PROGRAM p; BEGIN END. hello", () => {
        assert.throws(() => {
          let ast = new pascal.Parser("PROGRAM p; BEGIN END. hello").parse();
        });
      });
    });
  });

  describe("Interpreter", () => {
    describe("should print GLOBAL_SCOPE successfully", () => {
      it("a b c d number", () => {
        let code = `\
PROGRAM p;
VAR
  a, b, c, number : INTEGER;
  d               : REAL;
BEGIN
  BEGIN
    number := 3;
    a := number;
    b := 10 * a + 10 * number div 4;
    c := a - - b;
    d := c / 3;
  END;
  a := 10;
END.`;
        assert.doesNotThrow(() => {
          let i = new pascal.Interpreter(code);
          i.eval();
          console.log(i.GLOBAL_SCOPE);
        });
      });

      it("a b number y", () => {
        let code = `\
PROGRAM Part11;
VAR
   number : INTEGER;
   a, b   : INTEGER;
   y      : REAL;

BEGIN {Part11}
   number := 2;
   a := number ;
   b := 10 * a + 10 * number DIV 4;
   y := 20 / 7 + 3.14
END.  {Part11}`;
        assert.doesNotThrow(() => {
          let i = new pascal.Interpreter(code);
          i.eval();
          console.log(i.GLOBAL_SCOPE);
        });
      });
    });

    it("program part10", () => {
      let code = `\
PROGRAM Part10;
VAR
   number     : INTEGER;
   a, b, c, x : INTEGER;
   y          : REAL;

BEGIN {Part10}
   BEGIN
      number := 2;
      a := number;
      b := 10 * a + 10 * number DIV 4;
      c := a - - b
   END;
   x := 11;
   y := 20 / 7 + 3.14;
   { writeln('a = ', a); }
   { writeln('b = ', b); }
   { writeln('c = ', c); }
   { writeln('number = ', number); }
   { writeln('x = ', x); }
   { writeln('y = ', y); }
END.  {Part10}`;
      assert.doesNotThrow(() => {
        let i = new pascal.Interpreter(code);
        i.eval();
        console.log(i.GLOBAL_SCOPE);
      });
    });
  });

  describe("SymbolTableBuilder", () => {
    describe("should print symbolTable successfully", () => {
      it("PROGRAM P4", () => {
        let code = `\
PROGRAM P4;
VAR
   x : INTEGER;

BEGIN
   x := 2;
END.`;
        assert.doesNotThrow(() => {
          let ast = new pascal.Parser(code).parse();
          let st = new pascal.SemanticAnalyzer().build(ast);
          // console.log(st);
        });
      });
    });

    describe("should throw Name Error", () => {
      it("PROGRAM NameError1", () => {
        let code = `\
PROGRAM NameError1;
VAR
   a : INTEGER;

BEGIN
   a := 2 + b;
END.`;
        assert.throws(() => {
          let ast = new pascal.Parser(code).parse();
          let st = new pascal.SymbolTableBuilder().build(ast);
        });
      });
    });
  });

  describe("semantic checks", () => {
    it("should give the position info", () => {
      let code = `\
program Main;
  var x : integer;
begin
  x := y;
end.`;

      assert.throws(() => {
        try {
          let ast = new pascal.Parser(code).parse();
          let st = new pascal.SemanticAnalyzer().build(ast);
        } catch (err) {
          console.error(err.message);
          throw err;
        }
      });
    });

    it("variables are declared before they are used", () => {
      let code = `\
program Main;
   var x : integer;

begin
    x := y;
end.`;

      assert.throws(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("procedure scope simple", () => {
      let code = `\      
program Main;
  var x, y: real;

  procedure Alpha(a : integer);
    var y : integer;
  begin

  end;

begin { Main }
end.  { Main }`;

      assert.doesNotThrow(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("two sub procedure in parent scope", () => {
      let code = `\      
program Main;
   var x, y : real;

   procedure AlphaA(a : integer);
      var y : integer;
   begin { AlphaA }
   end;  { AlphaA }

   procedure AlphaB(a : integer);
      var b : integer;
   begin { AlphaB }

   end;  { AlphaB }

begin { Main }
    
end.  { Main }`;
      assert.doesNotThrow(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("should throw when access var not in scope ", () => {
      let code = `\      
program Main;
   var x, y : real;

   procedure AlphaA(a : integer);
      var y : integer;
   begin { AlphaA }
   end;  { AlphaA }

   procedure AlphaB(a : integer);
      var b : integer;
   begin { AlphaB }

   end;  { AlphaB }

begin { Main }
    a := 10;
end.  { Main }`;
      assert.throws(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("should not throw when access var in parent scope ", () => {
      let code = `\      
program Main;
   var x, y : real;

   procedure AlphaA(a : integer);
      var y : integer;
   begin { AlphaA }
      x := 12.5;
   end;  { AlphaA }

begin { Main }
end.  { Main }`;
      assert.doesNotThrow(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("should not throw when access var in parent scope more depth", () => {
      let code = `\      
program Main;
   var x, y : real;

   procedure AlphaA(a : integer);
      var y : integer;
      procedure AlphaB(a : integer);
        var z : integer;
      begin { Alpha B }
        x := 15.6;
      end;  { Alpha B }
   begin { AlphaA }
   end;  { AlphaA }

begin { Main }
end.  { Main }`;
      assert.doesNotThrow(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("should throw when redeclaretion at the same scope", () => {
      let code = `\      
program Main;
   var x, y : real;

   procedure AlphaA(a : integer);
      var a : integer;
   begin { AlphaA }
   end;  { AlphaA }

begin { Main }
end.  { Main }`;
      assert.throws(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("should throw when redeclaretion at the same scope 2", () => {
      let code = `\      
program Main;
   var x, y : real;

   procedure AlphaA(b : integer);
      var a : integer;
      var a : integer;
   begin { AlphaA }
   end;  { AlphaA }

begin { Main }
end.  { Main }`;
      assert.throws(() => {
        let ast = new pascal.Parser(code).parse();
        let st = new pascal.SemanticAnalyzer().build(ast);
      });
    });

    it("with procedure call", () => {
      let code = `\
program Main;

procedure Alpha(a : integer; b : integer);
var x : integer;
begin
 x := (a + b ) * 2;
end;

begin { Main }

 Alpha(3 + 5, 7);  { procedure call }

end.  { Main }`;

      assert.doesNotThrow(() => {
        let ast = new pascal.Parser(code).parse();
        // console.log(ast.block.compoundStatemen);
        let st = new pascal.SemanticAnalyzer().build(ast);
        // console.log(ast);
        // ast.block.declarations.forEach((d) => {
        //   console.log(d);
        // });
      });
    });

    it("should check the params length", () => {
      let code = `\
program Main;

procedure Alpha(a : integer; b : integer);
var x : integer;
begin
 x := (a + b ) * 2;
end;

begin { Main }

 Alpha(3, 5, 7);  { procedure call }

end.  { Main }`;
      assert.throws(() => {
        try {
          let ast = new pascal.Parser(code).parse();
          let st = new pascal.SemanticAnalyzer().build(ast);
        } catch (err) {
          // console.error(err);
          throw err;
        }
        // console.log(ast);
        // ast.block.declarations.forEach((d) => {
        //   console.log(d);
        // });
      });
    });
  });
});

const ast = require("../arithmetic/calc10");
const assert = require("assert");

describe("ast", () => {
  it("(1 + 2) * 3", () => {
    assert.equal(new ast.Interpreter("(1 + 2) * 3").eval(), 9);
  });

  it(" 5 / 1 * 2 + 78", () => {
    assert.equal(new ast.Interpreter(" 5 / 1 * 2 + 78").eval(), 88);
  });

  it("7 + 3 * (10 / (12 / (3 + 1) - 1))", () => {
    assert.equal(
      new ast.Interpreter("7 + 3 * (10 / (12 / (3 + 1) - 1))").eval(),
      22
    );
  });

  it(" 7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)", () => {
    assert.equal(
      new ast.Interpreter(
        " 7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)"
      ).eval(),
      10
    );
  });

  it("7 + (((3 + 2)))", () => {
    assert.equal(new ast.Interpreter("7 + (((3 + 2)))").eval(), 12);
  });

  describe("unary op", () => {
    it("7 * -5", () => {
      assert.equal(new ast.Interpreter("7 * -5").eval(), -35);
    });

    it("1 + 5 - -6", () => {
      assert.equal(new ast.Interpreter("1 + 5 - -6").eval(), 12);
    });

    it("1 + 5 --6", () => {
      assert.equal(new ast.Interpreter("1 + 5 --6").eval(), 12);
    });

    it("10 + 45 + -+-+6", () => {
      assert.equal(new ast.Interpreter("10 + 45 + -+-+6").eval(), 61);
    });
  });
});

describe("TransPost", () => {
  it('"(5 + 3) * 12 / 3" => "5 3 + 12 * 3 /"', () => {
    assert.equal(
      new ast.TransPost("(5 + 3) * 12 / 3").trans(),
      "5 3 + 12 * 3 /"
    );
  });
});

describe("TransPre", () => {
  it("2 + 3", () => {
    assert.equal(new ast.TransPre("2 + 3").trans(), "(+ 2 3)");
  });

  it("(2 + 3 * 5)", () => {
    assert.equal(new ast.TransPre("(2 + 3 * 5)").trans(), "(+ 2 (* 3 5))");
  });
});

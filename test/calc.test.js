const Interpreter = require("../arithmetic/calc8");
const assert = require("assert");

describe("calc basic", () => {
  it("1 + 2", () => {
    let ret = new Interpreter("1 + 2").expr();
    assert.equal(ret, 3);
  });
  it(" 1 + 3", () => {
    let ret = new Interpreter(" 1 + 3").expr();
    assert.equal(ret, 4);
  });
  it(" 1 + 3  ", () => {
    let ret = new Interpreter(" 1 + 3  ").expr();
    assert.equal(ret, 4);
  });
  it("3 - 1", () => {
    let ret = new Interpreter("3 - 1").expr();
    assert.equal(ret, 2);
  });
  it("125 + 25", () => {
    let ret = new Interpreter("125 + 25").expr();
    assert.equal(ret, 150);
  });
  it("163 - 32", () => {
    let ret = new Interpreter("163 - 32").expr();
    assert.equal(ret, 131);
  });

  // error
  it("abc", () => {
    let i = new Interpreter("abc");
    assert.throws(() => i.expr());
  });
});

describe("cal mul div", () => {
  // mul
  it("6 * 3", () => {
    let ret = new Interpreter("6 * 3").expr();
    assert.equal(ret, 18);
  });

  it("6 / 3", () => {
    let ret = new Interpreter("6 / 3").expr();
    assert.equal(ret, 2);
  });

  it("66 / 3", () => {
    let ret = new Interpreter("66 / 3").expr();
    assert.equal(ret, 22);
  });

  it("7 * 4 / 2 * 3", () => {
    let ret = new Interpreter("7 * 4 / 2 * 3").expr();
    assert.equal(ret, 42);
  });
  it("7 * 4 / 2 * 3 + 10", () => {
    let ret = new Interpreter("7 * 4 / 2 * 3 + 10").expr();
    assert.equal(ret, 52);
  });
  it("7 * 4 / 2 * 3 - 2 + 3 * 6", () => {
    let ret = new Interpreter("7 * 4 / 2 * 3 - 2 + 3 * 6").expr();
    assert.equal(ret, 58);
  });
});

describe("calc arbitrary number", () => {
  it("9 - 5 + 3 + 11", () => {
    let ret = new Interpreter("9 - 5 + 3 + 11").expr();
    assert.equal(ret, 18);
  });
});

describe("calc with parentheses", () => {
  it("9 - 5 * (3 + 11)", () => {
    let ret = new Interpreter("9 - 5 * (3 + 11)").expr();
    assert.equal(ret, -61);
  });

  it("9 - 5 * (3 + 11", () => {
    let i = new Interpreter("9 - 5 * (3 + 11");
    assert.throws(() => {
      i.expr();
    });
  });

  it(" 7 + 3 * (10 / (12 / (3 + 1) - 1))", () => {
    assert.equal(
      new Interpreter(" 7 + 3 * (10 / (12 / (3 + 1) - 1))").expr(),
      22
    );
  });
});

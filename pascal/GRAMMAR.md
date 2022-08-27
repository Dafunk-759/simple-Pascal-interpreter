## GRAMMAR

  pragram             :  PROGRAM ID SEMI block DOT

  block               :  declarations compoundStatement

  declarations        :  
                      (  
                        VAR (variableDeclaration SEMI)+
                        | (PROCEDURE ID formalParamList SEMI block SEMI)*
                      )*
                      |  empty
  
  formalParamList     |  (LPAREN formalParam (SEMI formalParam)* RPAREN)?

  formalParam         |  ID (COMMA ID)* COLON typeSpec
                    
  variableDeclaration :  variable (COMMA variable)* COLON typeSpec

  typeSpec            :  INTEGER | REAL

  compoundStatement   :  BEGIN statementList END

  statementList       :  statement
                      |  statement SEMI statementList
  
  ??
  is this right?
  statementList       :  statement (SEMI statement)*
  ??

  statement           :  compoundStatement
                      |  ifStatement
                      |  assignmentStatement
                      |  procCallStatement
                      |  whileStatement
                      |  empty
  
  assignmentStatement :  variable ASSIGN expr

  procCallStatement   :  ID LPAREN (expr (COMMA expr)*)? RPAREN

  ifStatement         :  IF LPAREN expr RPAREN statement \
                        (ELSE statement)?

  whileStatement      : WHILE LPAREN expr RPAREN statement

  empty               :  


  expr                :  arithmeticExpr1 ((EQ | GTEQ | LTEQ | GT | LT) arithmeticExpr1)*

  arithmeticExpr1     :  arithmeticExpr2 ((PLUS | MINUS) arithmeticExpr2)*

  arithmeticExpr2     :  factor ((MUL | INT_DIV | FLOAT_DIV) factor)*

  factor              :  PLUS factor
                      |  MINUS factor
                      |  INT_CONST
                      |  REAL_CONST
                      |  LPAREN expr RPAREN
                      |  variable
  
  variable            :  ID


## new tokens 1
- changes
old    new
DIV => INT_DIV
INT => INT_CONST

- new
PROGRAM
COMMA
COLON

INTEGER
REAL

FLOAT_DIV
REAL_CONST

## new tokens 2
- new
PROCEDURE
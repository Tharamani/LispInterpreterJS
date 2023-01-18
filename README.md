# LispInterpreterJS
Lisp Interpreter in JS

Project's Title - (How to Write a (Lisp) Interpreter (in Javascript))

1. Purpose: To build an interpreter for Scheme dialect of Lisp using Javascript as the implementation language.

2. Project Description: Application accept expression(lisp), parses expression and evaluates expression
> Evaluates basic Mathematical, comparision, logical operations
> Evaluates special forms ['if', 'define', 'quote', 'lambda', 'set!', 'begin']
GlobalEnvvironment is a object that contains key as function names and values as functions
written in JS.

There are 2 main phases :
1. Parsing
2. Evaluating

Execution starts from main, parsing the expression then calls expressionEval function to check whether parsed expression is compound expression or an atom.

If compound i.e (expression), first value in the expression is the operator(JS functions in GE) and remaining are the args, gets all the remaining args by parsing and evaluating

If compound i.e (expression), first value in the expression is special forms, special eval functions will evaluates the expression.

If atom, evalutes to value

3. How to Install and Run the Project
> Clone project from github : git clone url
> Navigate to test folder
> Run the command : node pass.js/fail.js

References
Links: https://norvig.com/lispy.html
https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.2

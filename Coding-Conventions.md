Abstract: as we start a new coding session with teammates we want to stick to a reference as explained here [#99](../issues/99).

We mainly want to stick to the Crockford document. It will become our reference for this list:
* Variable Declaration
* indentation: 4 spaces
* 2 line return at the end of file

http://javascript.crockford.com/code.html

## Conditions

```js
if (null == variable) {
    return null;
} else if ('test' !== variable) {
    return false;
} else {
    // code...
}
```
1. When appliable, check the constant value before the variable.
It allows for more visibility in the code, and prevents unwanted assignments.

2. For multiple conditions, put the next one on the same line as the last closing bracket.

3. Use the strict equality check `===`, except when we want to test for equivalent values.

4. Always use braces and put the instructions on a new line. Even for single-line conditions containing a return statement.
This way we can insert new instructions within the same condition without modifying existing lines.

## Variables

```js
var i = 0;
var maximumValue = list.length;
i  = 1;
i += 2;
```

1. Always use the `var` keyword for each variable.

2. Don't vertically align operators, unless you do so for the same variable ; this way the lines are not dependent.

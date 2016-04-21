Abstract: as we start a new coding session with teammates we want to stick to a reference as explained here [#99](../issues/99).

We mainly want to stick to the Crockford document. It will become our reference for this list:
* Variable Declaration
* indentation: 4 spaces

http://javascript.crockford.com/code.html

## Conditions

```js
if (null === variable) {
    // code...
} else if ('test' !== variable) {
    // code...
} else {
    // code...
}
```
- When appliable, check the constant value before the variable
It allows for more visibility in the code, and prevents unwanted assignments.
- For multiple conditions, put the next one on the same line as the last closing bracket

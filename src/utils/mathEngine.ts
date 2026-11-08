/**
 * Robust Mathematical Engine for Cosmic Calculator
 * Implements Shunting-Yard tokenization & Reverse Polish Notation (RPN) evaluation
 * with angle mode (DEG/RAD), error protection, scientific functions, and floating point cleanup.
 */

export type AngleMode = 'DEG' | 'RAD';

export interface EvaluationResult {
  success: boolean;
  result?: number;
  formatted?: string;
  error?: string;
}

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires non-negative integer');
  }
  if (n > 170) {
    throw new Error('Overflow: n! too large');
  }
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Token types
type TokenType = 'NUMBER' | 'OP' | 'FUNC' | 'LPAREN' | 'RPAREN' | 'POSTFIX';

interface Token {
  type: TokenType;
  value: string;
}

export class MathEngine {
  public static evaluate(expr: string, angleMode: AngleMode = 'DEG'): EvaluationResult {
    try {
      if (!expr || expr.trim() === '') {
        return { success: true, result: 0, formatted: '0' };
      }

      const tokens = this.tokenize(expr);
      const rpn = this.toRPN(tokens);
      const val = this.evalRPN(rpn, angleMode);

      if (isNaN(val)) {
        return { success: false, error: 'Undefined result' };
      }
      if (!isFinite(val)) {
        return { success: false, error: 'Cannot divide by zero (Infinite)' };
      }

      // Clean floating point precision inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004)
      const cleanVal = this.roundPrecision(val);
      const formatted = this.formatNumber(cleanVal);

      return {
        success: true,
        result: cleanVal,
        formatted,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Syntax Error';
      return { success: false, error: message };
    }
  }

  private static roundPrecision(num: number): number {
    if (Math.abs(num) < 1e-14 && num !== 0) return 0;
    return Number(num.toPrecision(14)) * 1;
  }

  public static formatNumber(num: number): string {
    if (isNaN(num)) return 'NaN';
    if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

    // Check if huge or microscopic
    const abs = Math.abs(num);
    if (abs >= 1e12 || (abs > 0 && abs < 1e-7)) {
      return num.toExponential(6).replace(/\.?0+e/, 'e');
    }

    // Standard string with max 10 decimal digits
    const str = num.toLocaleString('en-US', {
      maximumFractionDigits: 10,
      useGrouping: false,
    });
    return str;
  }

  private static tokenize(expr: string): Token[] {
    const clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .trim();

    const tokens: Token[] = [];
    let i = 0;

    const isDigitOrDot = (ch: string) => /[0-9.]/.test(ch);
    const isLetter = (ch: string) => /[a-z]/i.test(ch);

    while (i < clean.length) {
      const ch = clean[i];

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      // Check numbers
      if (isDigitOrDot(ch)) {
        let numStr = '';
        while (i < clean.length && isDigitOrDot(clean[i])) {
          numStr += clean[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: numStr });
        continue;
      }

      // Check word functions or constants
      if (isLetter(ch)) {
        let word = '';
        while (i < clean.length && isLetter(clean[i])) {
          word += clean[i].toLowerCase();
          i++;
        }

        if (word === 'pi') {
          tokens.push({ type: 'NUMBER', value: String(Math.PI) });
        } else if (word === 'e') {
          tokens.push({ type: 'NUMBER', value: String(Math.E) });
        } else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt', 'abs'].includes(word)) {
          tokens.push({ type: 'FUNC', value: word });
        } else {
          throw new Error(`Unknown function: ${word}`);
        }
        continue;
      }

      // Parentheses
      if (ch === '(') {
        // Implicit multiplication check (e.g. 5(3))
        if (tokens.length > 0 && (tokens[tokens.length - 1].type === 'NUMBER' || tokens[tokens.length - 1].type === 'RPAREN')) {
          tokens.push({ type: 'OP', value: '*' });
        }
        tokens.push({ type: 'LPAREN', value: '(' });
        i++;
        continue;
      }
      if (ch === ')') {
        tokens.push({ type: 'RPAREN', value: ')' });
        i++;
        continue;
      }

      // Postfix operators: ! and %
      if (ch === '!') {
        tokens.push({ type: 'POSTFIX', value: '!' });
        i++;
        continue;
      }
      if (ch === '%') {
        tokens.push({ type: 'POSTFIX', value: '%' });
        i++;
        continue;
      }

      // Operators: +, -, *, /, ^
      if (['+', '-', '*', '/', '^'].includes(ch)) {
        // Check for unary minus
        const prev = tokens[tokens.length - 1];
        if (ch === '-' && (!prev || prev.type === 'OP' || prev.type === 'LPAREN' || prev.type === 'FUNC')) {
          tokens.push({ type: 'NUMBER', value: '0' });
          tokens.push({ type: 'OP', value: '-' });
        } else {
          tokens.push({ type: 'OP', value: ch });
        }
        i++;
        continue;
      }

      throw new Error(`Unexpected character: ${ch}`);
    }

    return tokens;
  }

  private static toRPN(tokens: Token[]): Token[] {
    const outputQueue: Token[] = [];
    const operatorStack: Token[] = [];

    const precedence: Record<string, number> = {
      '+': 2,
      '-': 2,
      '*': 3,
      '/': 3,
      '^': 4,
    };

    const isRightAssociative = (op: string) => op === '^';

    for (const token of tokens) {
      if (token.type === 'NUMBER') {
        outputQueue.push(token);
      } else if (token.type === 'POSTFIX') {
        outputQueue.push(token);
      } else if (token.type === 'FUNC') {
        operatorStack.push(token);
      } else if (token.type === 'OP') {
        const o1 = token.value;
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type !== 'LPAREN' &&
          (operatorStack[operatorStack.length - 1].type === 'FUNC' ||
            (precedence[operatorStack[operatorStack.length - 1].value] || 0) > precedence[o1] ||
            ((precedence[operatorStack[operatorStack.length - 1].value] || 0) === precedence[o1] && !isRightAssociative(o1)))
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else if (token.type === 'LPAREN') {
        operatorStack.push(token);
      } else if (token.type === 'RPAREN') {
        let foundLeft = false;
        while (operatorStack.length > 0) {
          const top = operatorStack.pop()!;
          if (top.type === 'LPAREN') {
            foundLeft = true;
            break;
          }
          outputQueue.push(top);
        }
        if (!foundLeft) {
          throw new Error('Mismatched parentheses');
        }
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNC') {
          outputQueue.push(operatorStack.pop()!);
        }
      }
    }

    while (operatorStack.length > 0) {
      const op = operatorStack.pop()!;
      if (op.type === 'LPAREN' || op.type === 'RPAREN') {
        throw new Error('Mismatched parentheses');
      }
      outputQueue.push(op);
    }

    return outputQueue;
  }

  private static evalRPN(rpn: Token[], angleMode: AngleMode): number {
    const stack: number[] = [];

    const toRad = (val: number) => (angleMode === 'DEG' ? (val * Math.PI) / 180 : val);
    const fromRad = (val: number) => (angleMode === 'DEG' ? (val * 180) / Math.PI : val);

    for (const token of rpn) {
      if (token.type === 'NUMBER') {
        stack.push(parseFloat(token.value));
      } else if (token.type === 'POSTFIX') {
        if (stack.length < 1) throw new Error('Invalid syntax');
        const a = stack.pop()!;
        if (token.value === '!') {
          stack.push(factorial(a));
        } else if (token.value === '%') {
          stack.push(a / 100);
        }
      } else if (token.type === 'OP') {
        if (stack.length < 2) throw new Error('Invalid syntax');
        const b = stack.pop()!;
        const a = stack.pop()!;
        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/':
            if (b === 0) throw new Error('Division by zero');
            stack.push(a / b);
            break;
          case '^': stack.push(Math.pow(a, b)); break;
          default: throw new Error(`Unknown operator: ${token.value}`);
        }
      } else if (token.type === 'FUNC') {
        if (stack.length < 1) throw new Error('Invalid function arguments');
        const a = stack.pop()!;
        switch (token.value) {
          case 'sin': stack.push(Math.sin(toRad(a))); break;
          case 'cos': stack.push(Math.cos(toRad(a))); break;
          case 'tan': {
            const rad = toRad(a);
            // Check undefined multiples of pi/2
            if (Math.abs(Math.cos(rad)) < 1e-15) {
              throw new Error('tan is undefined at 90° / π/2');
            }
            stack.push(Math.tan(rad));
            break;
          }
          case 'asin': {
            if (a < -1 || a > 1) throw new Error('Domain error for asin');
            stack.push(fromRad(Math.asin(a)));
            break;
          }
          case 'acos': {
            if (a < -1 || a > 1) throw new Error('Domain error for acos');
            stack.push(fromRad(Math.acos(a)));
            break;
          }
          case 'atan': stack.push(fromRad(Math.atan(a))); break;
          case 'log': {
            if (a <= 0) throw new Error('Domain error: log requires positive number');
            stack.push(Math.log10(a));
            break;
          }
          case 'ln': {
            if (a <= 0) throw new Error('Domain error: ln requires positive number');
            stack.push(Math.log(a));
            break;
          }
          case 'sqrt': {
            if (a < 0) throw new Error('Domain error: sqrt requires non-negative number');
            stack.push(Math.sqrt(a));
            break;
          }
          case 'cbrt': stack.push(Math.cbrt(a)); break;
          case 'abs': stack.push(Math.abs(a)); break;
          default: throw new Error(`Unknown function: ${token.value}`);
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }

    return stack[0];
  }
}

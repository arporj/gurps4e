/**
 * Safe expression evaluator for GURPS attribute base expressions.
 * Supports: "$attr_id", literals, arithmetic (+,-,*,/), Math.floor(), Math.round(), Math.ceil()
 * Does NOT use eval() — fully sandboxed.
 */
export type AttributeValues = Record<string, number>

export function evaluateExpression(expr: string, attrs: AttributeValues): number {
  if (!expr || expr.trim() === '') return 0

  // Replace attribute references: $attr_id → numeric value
  let processed = expr.trim()

  // Sort by length descending to avoid partial replacement (e.g., $basic_speed before $basic)
  const attrIds = Object.keys(attrs).sort((a, b) => b.length - a.length)
  for (const id of attrIds) {
    const value = attrs[id] ?? 0
    processed = processed.replaceAll(`$${id}`, String(value))
  }

  // Parse and evaluate safely
  try {
    return safeEval(processed)
  } catch {
    return 0
  }
}

type Token = { type: 'number'; value: number } | { type: 'op'; value: string } | { type: 'lparen' } | { type: 'rparen' } | { type: 'func'; name: string }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < expr.length) {
    const ch = expr[i]
    if (/\s/.test(ch)) { i++; continue }
    if (/[0-9.]/.test(ch)) {
      let num = ''
      while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++]
      tokens.push({ type: 'number', value: parseFloat(num) })
    } else if (/[+\-*/]/.test(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
    } else if (ch === '(') { tokens.push({ type: 'lparen' }); i++ }
    else if (ch === ')') { tokens.push({ type: 'rparen' }); i++ }
    else if (/[a-zA-Z_]/.test(ch)) {
      let name = ''
      while (i < expr.length && /[a-zA-Z_.0-9]/.test(expr[i])) name += expr[i++]
      // Consume '(' if function call
      if (i < expr.length && expr[i] === '(') {
        tokens.push({ type: 'func', name })
      } else {
        // Unknown identifier — treat as 0
        tokens.push({ type: 'number', value: 0 })
      }
    } else {
      i++ // skip unknown char
    }
  }
  return tokens
}

// Recursive descent parser: expr → term (('+' | '-') term)*
function safeEval(expr: string): number {
  const tokens = tokenize(expr)
  let pos = 0

  function peek() { return tokens[pos] }
  function consume() { return tokens[pos++] }

  function parsePrimary(): number {
    const tok = peek()
    if (!tok) return 0

    if (tok.type === 'number') {
      consume()
      return tok.value
    }
    if (tok.type === 'lparen') {
      consume()
      const val = parseExpr()
      if (peek()?.type === 'rparen') consume()
      return val
    }
    if (tok.type === 'func') {
      const funcName = tok.name
      consume() // func token
      if (peek()?.type === 'lparen') consume() // '(' already consumed conceptually — actually need re-check
      // Wait — the tokenizer already doesn't push lparen after func name...
      // Let's fix: after func token we need to consume the '(' from tokenize
      // Actually in tokenize, we push func and DON'T push lparen separately.
      // So we need to parse the inner expression:
      const inner = parseExpr()
      if (peek()?.type === 'rparen') consume()
      // Apply function
      const mathFuncs: Record<string, (x: number) => number> = {
        'Math.floor': Math.floor,
        'Math.round': Math.round,
        'Math.ceil': Math.ceil,
        'Math.abs': Math.abs,
      }
      return mathFuncs[funcName]?.(inner) ?? inner
    }
    if (tok.type === 'op' && tok.value === '-') {
      consume()
      return -parsePrimary()
    }
    return 0
  }

  function parseTerm(): number {
    let val = parsePrimary()
    while (peek()?.type === 'op' && (peek()!.value === '*' || peek()!.value === '/')) {
      const op = consume().value
      const right = parsePrimary()
      val = op === '*' ? val * right : (right !== 0 ? val / right : 0)
    }
    return val
  }

  function parseExpr(): number {
    let val = parseTerm()
    while (peek()?.type === 'op' && (peek()!.value === '+' || peek()!.value === '-')) {
      const op = consume().value
      const right = parseTerm()
      val = op === '+' ? val + right : val - right
    }
    return val
  }

  return parseExpr()
}

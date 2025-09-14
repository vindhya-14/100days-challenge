// Recursive-descent parser for arithmetic expressions
// Grammar (no left recursion):
// E -> T E'
// E' -> + T E' | - T E' | ε
// T -> F T'
// T' -> * F T' | / F T' | ε
// F -> ( E ) | number

function tokenize(input) {
  const tokens = []
  const s = input.replace(/\s+/g, '')
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (/[0-9]/.test(ch)) {
      let num = ch
      i++
      while (i < s.length && /[0-9]/.test(s[i])) {
        num += s[i++]
      }
      tokens.push({ type: 'number', value: num })
      continue
    }
    if ('+-*/()'.includes(ch)) {
      tokens.push({ type: ch, value: ch })
      i++
      continue
    }
    throw new Error('Unexpected character ' + ch)
  }
  tokens.push({ type: 'EOF' })
  return tokens
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0
  }
  peek() {
    return this.tokens[this.pos]
  }
  next() {
    return this.tokens[this.pos++]
  }

  // E -> T E'
  parseE() {
    const t = this.parseT()
    const ePrime = this.parseEPrime()
    if (ePrime === null) return t
    return ePrime(t)
  }

  // E' -> (+|-) T E' | ε
  parseEPrime() {
    const tok = this.peek()
    if (tok.type === '+' || tok.type === '-') {
      const op = this.next().type
      const t = this.parseT()
      const rest = this.parseEPrime()
      return (left) => {
        const node = { type: op, children: [left, t] }
        return rest ? rest(node) : node
      }
    }
    return null
  }

  // T -> F T'
  parseT() {
    const f = this.parseF()
    const tPrime = this.parseTPrime()
    return tPrime ? tPrime(f) : f
  }

  // T' -> (*|/) F T' | ε
  parseTPrime() {
    const tok = this.peek()
    if (tok.type === '*' || tok.type === '/') {
      const op = this.next().type
      const f = this.parseF()
      const rest = this.parseTPrime()
      return (left) => {
        const node = { type: op, children: [left, f] }
        return rest ? rest(node) : node
      }
    }
    return null
  }

  // F -> ( E ) | number
  parseF() {
    const tok = this.peek()
    if (tok.type === 'number') {
      this.next()
      return { type: 'num', value: Number(tok.value) }
    }
    if (tok.type === '(') {
      this.next()
      const e = this.parseE()
      const nxt = this.next()
      if (!nxt || nxt.type !== ')') throw new Error('Expected \')\'')
      return e
    }
    throw new Error('Expected number or (')
  }
}

export function parseExpression(input) {
  const tokens = tokenize(input)
  const p = new Parser(tokens)
  const tree = p.parseE()
  const eof = p.next()
  if (!eof || eof.type !== 'EOF') throw new Error('Unexpected tokens at end')
  return tree
}

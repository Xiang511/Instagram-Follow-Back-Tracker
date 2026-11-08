// 虛擬碼的語法上色:只把每一行切成帶類型的片段，顏色由畫面端決定，不改動虛擬碼本身
export type TokenType = 'plain' | 'comment' | 'keyword' | 'func' | 'string' | 'variable'

export interface Token {
  text: string
  type: TokenType
}

// 依優先順序比對:註解 > 檔名 > 關鍵字 > 函式呼叫 > 變數
// 函式呼叫用 lookahead 判斷後面接 (，所以像「結果.加入(人)」只有「加入」會被視為函式
const pattern = new RegExp(
  [
    '(#.*$)',
    '([\\w-]+\\.json)',
    '(FOR EACH|FOR|IF|IN|不在)',
    '([^\\s()=\\[\\].,:]+)(?=\\()',
    '(followers|following|名單|結果|人)',
  ].join('|'),
  'g',
)

const types: TokenType[] = ['comment', 'string', 'keyword', 'func', 'variable']

/** 把一行虛擬碼切成片段;串起所有片段的文字會等於原本那一行 */
export function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  let last = 0

  for (const match of line.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > last) tokens.push({ text: line.slice(last, start), type: 'plain' })

    // match[1..5] 對應上面五組，哪一組有值就是哪一種類型
    const group = match.findIndex((value, i) => i > 0 && value !== undefined)
    tokens.push({ text: match[0], type: types[group - 1] ?? 'plain' })
    last = start + match[0].length
  }

  if (last < line.length) tokens.push({ text: line.slice(last), type: 'plain' })
  return tokens
}

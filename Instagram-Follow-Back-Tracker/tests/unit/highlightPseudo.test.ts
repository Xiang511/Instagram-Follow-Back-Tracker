import { describe, expect, it } from 'vitest'

import { tokenize } from '../../app/utils/highlightPseudo'

const join = (line: string) =>
  tokenize(line)
    .map((t) => t.text)
    .join('')

describe('tokenize', () => {
  it('串回來的文字等於原本那一行', () => {
    const lines = [
      '# 比對過程(都在你的瀏覽器裡執行)',
      'followers = 讀取(followers.json)',
      'FOR EACH 人 IN following:',
      '    IF 人.帳號 不在 名單:',
      '        結果.加入(人)',
      '顯示(結果)  # 你追蹤、對方沒追你',
      '',
    ]
    for (const line of lines) expect(join(line)).toBe(line)
  })

  it('整行註解只有一個 comment 片段', () => {
    expect(tokenize('# 說明')).toEqual([{ text: '# 說明', type: 'comment' }])
  })

  it('辨識關鍵字、檔名與函式呼叫', () => {
    const types = Object.fromEntries(
      tokenize('followers = 讀取(followers.json)').map((t) => [t.text, t.type]),
    )
    expect(types['followers']).toBe('variable')
    expect(types['讀取']).toBe('func')
    expect(types['followers.json']).toBe('string')
  })

  it('FOR EACH 與 IN 都是關鍵字,變數不被誤判', () => {
    const tokens = tokenize('FOR EACH 人 IN following:')
    expect(tokens.filter((t) => t.type === 'keyword').map((t) => t.text)).toEqual([
      'FOR EACH',
      'IN',
    ])
    expect(tokens.filter((t) => t.type === 'variable').map((t) => t.text)).toEqual([
      '人',
      'following',
    ])
  })

  it('結果.加入(人) 只有「加入」是函式', () => {
    const tokens = tokenize('        結果.加入(人)')
    expect(tokens.filter((t) => t.type === 'func').map((t) => t.text)).toEqual(['加入'])
  })

  it('行內註解只上色到行尾', () => {
    const tokens = tokenize('顯示(結果)  # 你追蹤')
    expect(tokens.at(-1)).toEqual({ text: '# 你追蹤', type: 'comment' })
  })
})

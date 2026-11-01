import { describe, expect, it } from 'vitest'

import { parseIgnoreList, toIgnoreListText } from '../../app/utils/ignore'

describe('toIgnoreListText', () => {
  it('以逗號分隔', () => {
    expect(toIgnoreListText(['a', 'b'])).toBe('a,b')
  })

  it('沒有資料時輸出固定文字(與原本一致)', () => {
    expect(toIgnoreListText([])).toBe('No ignored users.')
  })
})

describe('parseIgnoreList', () => {
  it('去除空白與空項目', () => {
    expect(parseIgnoreList(' a, b ,,c,  ')).toEqual(['a', 'b', 'c'])
  })

  it('空字串回傳空陣列', () => {
    expect(parseIgnoreList('')).toEqual([])
  })
})

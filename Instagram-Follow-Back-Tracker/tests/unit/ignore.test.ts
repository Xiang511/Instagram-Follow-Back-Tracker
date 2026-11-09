import { describe, expect, it } from 'vitest'

import {
  ignoreTextErrors,
  mergeIgnoreData,
  parseIgnoreFile,
  parseIgnoreList,
  toIgnoreDataJSON,
  toIgnoreListText,
} from '../../app/utils/ignore'

describe('parseIgnoreFile(舊版匯出，向下相容)', () => {
  it('讀得回舊版匯出的逗號分隔文字，沒有標籤', () => {
    expect(parseIgnoreFile(toIgnoreListText(['a', 'b', 'c']))).toEqual({
      ignore: ['a', 'b', 'c'],
      tags: {},
    })
  })

  it('也接受換行分隔、BOM 與重複項目', () => {
    const bom = String.fromCharCode(0xfeff)
    expect(parseIgnoreFile(`${bom}a\r\nb\n a ,c`)?.ignore).toEqual(['a', 'b', 'c'])
  })

  it('舊版在沒有資料時匯出的固定文字視為空資料', () => {
    expect(parseIgnoreFile('No ignored users.')).toEqual({ ignore: [], tags: {} })
    expect(parseIgnoreFile('  ')).toEqual({ ignore: [], tags: {} })
  })

  it('接受 JSON 陣列', () => {
    expect(parseIgnoreFile('["a","b"]')).toEqual({ ignore: ['a', 'b'], tags: {} })
  })
})

describe('parseIgnoreFile(目前格式)', () => {
  it('讀得回 toIgnoreDataJSON 的輸出，忽略名單與標籤都在', () => {
    const data = { ignore: ['a', 'b'], tags: { a: '朋友', c: '同事' } }
    expect(parseIgnoreFile(toIgnoreDataJSON(data))).toEqual(data)
  })

  it('與瀏覽器儲存的格式相同(只有 ignore 或只有 tags 都可以)', () => {
    expect(parseIgnoreFile('{"ignore":["a"]}')).toEqual({ ignore: ['a'], tags: {} })
    expect(parseIgnoreFile('{"tags":{"a":"x"}}')).toEqual({ ignore: [], tags: { a: 'x' } })
  })

  it('標籤只收非空字串，其他項目忽略', () => {
    const text = '{"ignore":[],"tags":{"a":" 朋友 ","b":"","c":5,"d":null}}'
    expect(parseIgnoreFile(text)?.tags).toEqual({ a: '朋友' })
  })

  it('格式不對時回傳 null', () => {
    expect(parseIgnoreFile('[1,2]')).toBeNull()
    expect(parseIgnoreFile('{"foo":1}')).toBeNull()
    expect(parseIgnoreFile('{"ignore":"a"}')).toBeNull()
    expect(parseIgnoreFile('[broken')).toBeNull()
  })
})

describe('mergeIgnoreData', () => {
  it('忽略名單保留原順序，只加入新的人', () => {
    const { data, addedIgnore } = mergeIgnoreData(
      { ignore: ['a', 'b'], tags: {} },
      { ignore: ['b', 'c', 'd'], tags: {} },
    )
    expect(data.ignore).toEqual(['a', 'b', 'c', 'd'])
    expect(addedIgnore).toBe(2)
  })

  it('已有標籤的人維持原標籤，只補上還沒有標籤的人', () => {
    const { data, addedTags } = mergeIgnoreData(
      { ignore: [], tags: { a: '原本' } },
      { ignore: [], tags: { a: '匯入', b: '新增' } },
    )
    expect(data.tags).toEqual({ a: '原本', b: '新增' })
    expect(addedTags).toBe(1)
  })

  it('內容都已存在時新增數量為 0', () => {
    const current = { ignore: ['a'], tags: { a: 'x' } }
    const result = mergeIgnoreData(current, current)
    expect(result.addedIgnore).toBe(0)
    expect(result.addedTags).toBe(0)
  })
})

describe('toIgnoreListText', () => {
  it('以逗號分隔', () => {
    expect(toIgnoreListText(['a', 'b'])).toBe('a,b')
  })

  it('沒有資料時輸出固定文字(與原本一致)', () => {
    expect(toIgnoreListText([])).toBe('No ignored users.')
  })
})

describe('ignoreTextErrors', () => {
  it('合法的 username 沒有錯誤，空字串也可以(代表清空)', () => {
    expect(ignoreTextErrors('alice,bob_01,a.b')).toEqual([])
    expect(ignoreTextErrors('')).toEqual([])
  })

  it('含空白、@、全形逗號或網址的項目會被指出來', () => {
    expect(ignoreTextErrors('alice,bad name,@bob')).toHaveLength(2)
    expect(ignoreTextErrors('alice，bob')).toHaveLength(1)
    expect(ignoreTextErrors('https://www.instagram.com/alice')).toHaveLength(1)
  })

  it('超過 30 個字的 username 不合法', () => {
    expect(ignoreTextErrors('a'.repeat(30))).toEqual([])
    expect(ignoreTextErrors('a'.repeat(31))).toHaveLength(1)
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

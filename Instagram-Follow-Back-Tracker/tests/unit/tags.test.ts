import { describe, expect, it } from 'vitest'

import { parseTagsText, tagsToText } from '../../app/utils/tags'

describe('tagsToText', () => {
  it('每行一筆 username,標籤', () => {
    expect(tagsToText({ alice: '朋友', bob: '同事' })).toBe('alice,朋友\nbob,同事')
  })

  it('沒有標籤時是空字串', () => {
    expect(tagsToText({})).toBe('')
  })
})

describe('parseTagsText', () => {
  it('讀得回 tagsToText 的輸出', () => {
    const tags = { alice: '朋友', bob: '同事' }
    expect(parseTagsText(tagsToText(tags))).toEqual({ tags, errors: [] })
  })

  it('只以第一個逗號切開，標籤可以含逗號', () => {
    expect(parseTagsText('alice,朋友,大學同學').tags).toEqual({ alice: '朋友,大學同學' })
  })

  it('去除前後空白、略過空行，支援 Windows 換行', () => {
    expect(parseTagsText(' alice , 朋友 \r\n\r\n bob,同事\r\n').tags).toEqual({
      alice: '朋友',
      bob: '同事',
    })
  })

  it('格式不正確的行不收，並說明是第幾行、什麼問題', () => {
    const result = parseTagsText('alice\n,朋友\nbob,\ncarol,同事')
    expect(result.tags).toEqual({ carol: '同事' })
    expect(result.errors).toEqual([
      '第 1 行「alice」缺少逗號',
      '第 2 行「,朋友」的 username 格式不正確',
      '第 3 行「bob,」沒有標籤',
    ])
  })

  it('username 含空白或全形符號時算格式不正確', () => {
    expect(parseTagsText('a b,朋友').errors).toHaveLength(1)
    expect(parseTagsText('alice，朋友').errors).toHaveLength(1)
    expect(parseTagsText('@alice,朋友').errors).toHaveLength(1)
    expect(parseTagsText('al.ice_01,朋友').errors).toEqual([])
  })

  it('同一個 username 出現多次時以最後一行為準', () => {
    expect(parseTagsText('alice,A\nalice,B').tags).toEqual({ alice: 'B' })
  })

  it('空字串代表沒有任何標籤', () => {
    expect(parseTagsText('')).toEqual({ tags: {}, errors: [] })
  })
})

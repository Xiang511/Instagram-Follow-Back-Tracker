import { describe, expect, it } from 'vitest'

import {
  getWatchlistRows,
  mergeWatchlist,
  parseWatchlistFile,
  toWatchlistJSON,
} from '../../app/utils/watchlist'

const user = (value: string, timestamp = 1) => ({
  value,
  href: `https://www.instagram.com/${value}`,
  timestamp,
})

describe('getWatchlistRows', () => {
  // 你追蹤 alice、bob、carol;其中 bob 沒有回追(在 result 內)
  const following = [user('alice', 10), user('bob', 20), user('carol', 30)]
  const result = [user('bob', 20)]

  it('依比對結果判斷每個人的回追狀態', () => {
    const rows = getWatchlistRows(['alice', 'bob', 'dave'], result, following)

    expect(Object.fromEntries(rows.map((r) => [r.value, r.status]))).toEqual({
      alice: 'followingBack',
      bob: 'notFollowingBack',
      dave: 'notFollowing',
    })
  })

  it('沒回追的排最前面，其次已回追，最後是你沒有追蹤的', () => {
    const rows = getWatchlistRows(['dave', 'alice', 'bob'], result, following)

    expect(rows.map((r) => r.value)).toEqual(['bob', 'alice', 'dave'])
  })

  it('同一狀態維持加入名單的先後順序', () => {
    const rows = getWatchlistRows(['carol', 'alice'], [], following)

    expect(rows.map((r) => r.value)).toEqual(['carol', 'alice'])
  })

  it('你沒有追蹤的人沒有追蹤時間，連結以 username 補上', () => {
    const [row] = getWatchlistRows(['dave'], result, following)

    expect(row).toMatchObject({
      timestamp: null,
      href: 'https://www.instagram.com/_u/dave',
    })
  })

  it('空名單回傳空陣列', () => {
    expect(getWatchlistRows([], result, following)).toEqual([])
  })
})

describe('parseWatchlistFile', () => {
  it('讀得回 toWatchlistJSON 的輸出', () => {
    expect(parseWatchlistFile(toWatchlistJSON(['a', 'b']))).toEqual({
      watchlist: ['a', 'b'],
      skipped: 0,
    })
  })

  it('也接受 { watchlist: [...] } 與逗號、換行分隔的文字', () => {
    expect(parseWatchlistFile('{"watchlist":["a","b"]}')?.watchlist).toEqual(['a', 'b'])
    expect(parseWatchlistFile('a, b\r\nc')?.watchlist).toEqual(['a', 'b', 'c'])
  })

  it('去除重複與 BOM，不合法的 username 略過並計數', () => {
    const bom = String.fromCharCode(0xfeff)
    expect(parseWatchlistFile(`${bom}["a","a","bad name","@b"]`)).toEqual({
      watchlist: ['a'],
      skipped: 2,
    })
  })

  it('格式不對時回傳 null', () => {
    expect(parseWatchlistFile('[1,2]')).toBeNull()
    expect(parseWatchlistFile('{"foo":1}')).toBeNull()
    expect(parseWatchlistFile('[broken')).toBeNull()
  })

  it('空檔案回傳空名單', () => {
    expect(parseWatchlistFile('')).toEqual({ watchlist: [], skipped: 0 })
  })
})

describe('mergeWatchlist', () => {
  it('保留原順序，只加入新的人', () => {
    expect(mergeWatchlist(['a', 'b'], ['b', 'c'])).toEqual({
      watchlist: ['a', 'b', 'c'],
      added: 1,
    })
  })

  it('內容都已存在時新增數量為 0', () => {
    expect(mergeWatchlist(['a'], ['a']).added).toBe(0)
  })
})

import { describe, expect, it } from 'vitest'

import { getWatchlistRows } from '../../app/utils/watchlist'

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

  it('沒回追的排最前面,其次已回追,最後是你沒有追蹤的', () => {
    const rows = getWatchlistRows(['dave', 'alice', 'bob'], result, following)

    expect(rows.map((r) => r.value)).toEqual(['bob', 'alice', 'dave'])
  })

  it('同一狀態維持加入名單的先後順序', () => {
    const rows = getWatchlistRows(['carol', 'alice'], [], following)

    expect(rows.map((r) => r.value)).toEqual(['carol', 'alice'])
  })

  it('你沒有追蹤的人沒有追蹤時間,連結以 username 補上', () => {
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

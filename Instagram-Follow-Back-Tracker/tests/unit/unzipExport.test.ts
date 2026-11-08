import { strToU8, zipSync } from 'fflate'
import { describe, expect, it } from 'vitest'

import { extractFollowData } from '../../app/utils/unzipExport'

const json = (data: unknown) => strToU8(JSON.stringify(data))

describe('extractFollowData', () => {
  it('不論資料夾層級，取出 followers 與 following', () => {
    const zip = zipSync({
      'connections/followers_and_following/followers_1.json': json([{ n: 1 }]),
      'connections/followers_and_following/following.json': json({ relationships_following: [] }),
      'media/photo.jpg': strToU8('not json'),
    })

    const result = extractFollowData(zip)

    expect(result.followers).toEqual([{ n: 1 }])
    expect(result.following).toEqual({ relationships_following: [] })
  })

  it('followers 被拆成多個檔案時，依編號合併', () => {
    const zip = zipSync({
      'followers_2.json': json([{ n: 2 }]),
      'followers_10.json': json([{ n: 10 }]),
      'followers_1.json': json([{ n: 1 }]),
      'following.json': json({}),
    })

    const result = extractFollowData(zip)

    expect(result.followers).toEqual([{ n: 1 }, { n: 2 }, { n: 10 }])
    expect(result.followerFileCount).toBe(3)
  })

  it('缺少 following.json 時丟出錯誤', () => {
    const zip = zipSync({ 'followers_1.json': json([]) })

    expect(() => extractFollowData(zip)).toThrow('找不到')
  })

  it('不是 ZIP 時丟出錯誤', () => {
    expect(() => extractFollowData(strToU8('hello'))).toThrow('不是有效的 ZIP')
  })

  it('followers 內容不是陣列時丟出錯誤', () => {
    const zip = zipSync({ 'followers_1.json': json({ a: 1 }), 'following.json': json({}) })

    expect(() => extractFollowData(zip)).toThrow('格式不正確')
  })
})

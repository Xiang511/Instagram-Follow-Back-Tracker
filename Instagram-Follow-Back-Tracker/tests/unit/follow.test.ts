import { describe, expect, it } from 'vitest'

import { Follower, Following, getNotFollowingBack } from '../../app/utils/follow'

const followersData = [
  { string_list_data: [{ value: 'alice', href: 'https://www.instagram.com/alice', timestamp: 1 }] },
  { string_list_data: [{ value: 'bob', href: 'https://www.instagram.com/bob', timestamp: 2 }] },
]

const followingData = {
  relationships_following: [
    // value 為空時,username 取自 title
    {
      title: 'alice',
      string_list_data: [{ href: 'https://www.instagram.com/_u/alice', timestamp: 3 }],
    },
    { title: 'carol', string_list_data: [{ value: '', timestamp: 4 }] },
  ],
}

describe('Follower', () => {
  it('攤平 followers.json', () => {
    expect(Follower(followersData)).toEqual([
      { value: 'alice', href: 'https://www.instagram.com/alice', timestamp: 1 },
      { value: 'bob', href: 'https://www.instagram.com/bob', timestamp: 2 },
    ])
  })

  it('格式不正確時丟出錯誤', () => {
    expect(() => Follower({ foo: 1 })).toThrow('followers')
  })
})

describe('Following', () => {
  it('使用 title 當 username,缺少 href 時補上個人頁連結', () => {
    expect(Following(followingData)).toEqual([
      { value: 'alice', href: 'https://www.instagram.com/_u/alice', timestamp: 3 },
      { value: 'carol', href: 'https://www.instagram.com/_u/carol', timestamp: 4 },
    ])
  })

  it('新版匯出:title 為空字串時,username 取自 value', () => {
    const data = {
      relationships_following: [
        {
          title: '',
          string_list_data: [
            { href: 'https://www.instagram.com/dave', value: 'dave', timestamp: 5 },
          ],
        },
      ],
    }
    expect(Following(data)).toEqual([
      { value: 'dave', href: 'https://www.instagram.com/dave', timestamp: 5 },
    ])
  })

  it('缺少 relationships_following 時丟出錯誤', () => {
    expect(() => Following([])).toThrow('following')
  })
})

describe('getNotFollowingBack', () => {
  it('回傳沒有回追你的人', () => {
    const result = getNotFollowingBack(Follower(followersData), Following(followingData))
    expect(result.map((user) => user.value)).toEqual(['carol'])
  })

  it('全部互追時為空陣列', () => {
    const followers = Follower(followersData)
    expect(getNotFollowingBack(followers, followers)).toEqual([])
  })

  it('followers 為空時,following 全部都是沒回追', () => {
    expect(getNotFollowingBack([], Following(followingData))).toHaveLength(2)
  })
})

import { describe, expect, it } from 'vitest'

import { formatTime } from '../../app/utils/formatTime'

const now = 1_700_000_000
const day = 60 * 60 * 24

describe('formatTime', () => {
  it('相對時間:3 個月前', () => {
    expect(formatTime(now - day * 95, false, now)).toBe('3 個月前')
  })

  it('相對時間:不到一分鐘以秒計', () => {
    expect(formatTime(now - 10, false, now)).toBe('10 秒前')
  })

  it('詳細日期:YYYY/MM/DD', () => {
    expect(formatTime(now, true, now)).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
  })
})

import { describe, expect, it } from 'vitest'

import { formatYMD, toExportCSV } from '../../app/utils/exportCsv'

// 以本地時間的正午產生時間戳,避免時區換日影響斷言
const ts = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12).getTime() / 1000

describe('formatYMD', () => {
  it('轉成 yyyy-MM-dd,月日補零', () => {
    expect(formatYMD(ts(2023, 1, 5))).toBe('2023-01-05')
    expect(formatYMD(ts(2023, 11, 15))).toBe('2023-11-15')
  })
})

describe('toExportCSV', () => {
  it('第一列為欄位名稱,每筆含 value、href、date、tag', () => {
    const data = [
      { value: 'alice', href: 'https://www.instagram.com/alice', timestamp: ts(2023, 11, 15) },
    ]

    expect(toExportCSV(data)).toBe(
      ['value,href,date,tag', 'alice,https://www.instagram.com/alice,2023-11-15,'].join('\r\n'),
    )
  })

  it('有標籤的使用者輸出對應的 tag', () => {
    const data = [
      { value: 'alice', href: 'a', timestamp: ts(2023, 11, 15) },
      { value: 'bob', href: 'b', timestamp: ts(2024, 2, 3) },
    ]

    expect(toExportCSV(data, { alice: '朋友' })).toBe(
      ['value,href,date,tag', 'alice,a,2023-11-15,朋友', 'bob,b,2024-02-03,'].join('\r\n'),
    )
  })

  it('含逗號、雙引號或換行的內容會用雙引號包起來', () => {
    const data = [{ value: 'alice', href: 'a', timestamp: 1 }]

    expect(toExportCSV(data, { alice: '好友,"同事"' })).toContain('"好友,""同事"""')
  })

  it('以公式字元開頭的標籤會補單引號,避免在 Excel 被執行', () => {
    const data = [{ value: 'alice', href: 'a', timestamp: 1 }]

    expect(toExportCSV(data, { alice: '=1+1' })).toContain(",'=1+1")
  })

  it('空資料只輸出欄位名稱', () => {
    expect(toExportCSV([])).toBe('value,href,date,tag')
  })
})

import { describe, expect, it } from 'vitest'

import { toExportJSON } from '../../app/utils/exportJson'

describe('toExportJSON', () => {
  it('格式與原本一致:每筆含 value、href、timestamp、tag,縮排 2 格', () => {
    const data = [{ value: 'alice', href: 'https://www.instagram.com/alice', timestamp: 1 }]

    expect(toExportJSON(data)).toBe(
      [
        '[',
        '  {',
        '    "value": "alice",',
        '    "href": "https://www.instagram.com/alice",',
        '    "timestamp": 1,',
        '    "tag": ""',
        '  }',
        ']',
      ].join('\n'),
    )
  })

  it('空資料輸出空陣列', () => {
    expect(toExportJSON([])).toBe('[]')
  })
})

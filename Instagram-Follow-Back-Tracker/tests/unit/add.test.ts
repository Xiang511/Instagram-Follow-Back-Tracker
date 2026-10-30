import { describe, it, expect } from 'vitest'

import { add } from '../../app/utils/add'

describe('add', () => {
  it('1 + 2 應該等於 3', () => {
    expect(add(1, 2)).toBe(3)
  })

  it('負數也能正確相加', () => {
    expect(add(-1, 4)).toBe(3)
  })
})

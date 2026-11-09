// 單元測試不經過 Nuxt 的自動匯入，所以明確 import
import { isValidUsername } from './ignore'

/**
 * 標籤編輯文字:每行一筆「username,標籤」
 * 標籤本身可以含逗號，所以只以每行第一個逗號切開
 */
export function tagsToText(tags: Record<string, string>) {
  return Object.entries(tags)
    .map(([name, tag]) => `${name},${tag}`)
    .join('\n')
}

/**
 * 把編輯文字轉回標籤表，並回報每一行的問題(沒有問題時 errors 是空陣列)
 * - 空行直接略過
 * - 沒有逗號、username 不合法或標籤是空的行都算格式不正確
 * - 同一個 username 出現多次時，以最後一行為準
 */
export function parseTagsText(text: string) {
  const tags: Record<string, string> = {}
  const errors: string[] = []

  text.split(/\r?\n/).forEach((line, i) => {
    if (line.trim() === '') return
    const index = line.indexOf(',')
    const name = index === -1 ? '' : line.slice(0, index).trim()
    const tag = index === -1 ? '' : line.slice(index + 1).trim()
    const label = `第 ${i + 1} 行「${line.trim()}」`

    if (index === -1) errors.push(`${label}缺少逗號`)
    else if (!isValidUsername(name)) errors.push(`${label}的 username 格式不正確`)
    else if (tag === '') errors.push(`${label}沒有標籤`)
    else tags[name] = tag
  })

  return { tags, errors }
}

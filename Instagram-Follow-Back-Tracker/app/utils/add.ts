/**
 * 回傳 a + b 的結果
 * 放在 app/utils 下，Nuxt 會自動引入，元件內可直接使用 add()
 */
export function add(a: number, b: number): number {
  return a + b
}

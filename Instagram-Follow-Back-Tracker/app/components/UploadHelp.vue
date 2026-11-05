<script setup lang="ts">
// 標題是症狀,點開才看處理方式,預設不佔版面
// 最後一項「注意事項」接在同一個清單裡,不另外獨立成一個區塊
const items = [
  {
    title: 'ZIP 找不到 followers 或 following',
    detail: '下載時只勾選「追蹤者及追蹤者清單」,格式選 JSON 後重新下載。',
  },
  {
    title: '提示不是有效的 JSON',
    detail: '請選 followers_1.json 與 following.json,不要選 HTML 檔。',
  },
  {
    title: '結果的人數不對',
    detail: '資料範圍選「所有時間」,兩個檔案要來自同一次下載。',
  },
  {
    title: '超過一小時沒收到通知信',
    detail: '這是正常的,Meta 有時處理得比較慢。',
  },
  {
    title: '已刪除的帳號還在列表',
    detail: '用「忽略名單」把它們隱藏。',
  },
  {
    title: 'Excel 開啟 CSV 變亂碼',
    detail: '改用「資料 > 從文字/CSV」匯入,編碼選 UTF-8。',
  },
  {
    title: '注意事項',
    detail: [
      '檔案只在瀏覽器內處理,不會上傳',
      '忽略名單與標籤存在本機,記得匯出備份',
      '追蹤者被拆成多個檔案時,ZIP 會自動合併',
      '請勿混用不同次下載的檔案',
      '下載的 JSON、CSV 不含忽略名單的人',
    ]
      .map((text) => `• ${text}`)
      .join('\n'),
  },
]
</script>

<template>
  <div class="mb-3">
    <BaseAccordion :items="items" />
  </div>
</template>

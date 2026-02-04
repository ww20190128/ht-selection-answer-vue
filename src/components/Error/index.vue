<!--

 * @LastEditTime: 2023-03-03 14:05:41
 * @Description: 
-->
<template>
  <div class="error">
    <van-empty image="error" description="加载失败，请刷新重试" />
    <van-button
      class="reload-button"
      color="#ff5d7d"
      round
      block
      @click="handleReload"
      >刷新</van-button
    >
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
function handleReload() {
  window.location.reload();
}
</script>

<style lang="less" scoped>
.error {
  width: 100%;
  height: 100vh;
  padding: 20px;
  background-color: #fff;
  .reload-button {
    margin: 20px 0 8px 0;
  }
  .footer {
    font-size: 14px;
    color: #969799;
    padding: 8px 0;
  }
}
</style>

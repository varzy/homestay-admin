<template>
  <div class="home">
    <aside class="home-aside">
      <el-menu class="home-aside-menu" @select="handleMenuSelected">
        <el-menu-item index="Index">
          <i class="el-icon-house"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="Travel">
          <i class="el-icon-position"></i>
          <span slot="title">旅途管理</span>
        </el-menu-item>
      </el-menu>
    </aside>
    <div class="home-content">
      <header class="header">
        <div class="left">bread</div>
        <div class="right">username</div>
      </header>
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',

  methods: {
    handleMenuSelected(index) {
      this.$router.push({ name: index });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;

  &-aside {
    flex-shrink: 0;
    width: 200px;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    box-shadow: 4px 0 8px 0 rgb(29 35 41 / 5%);
    z-index: 502;

    &-menu {
      border-right: 0;
    }
  }

  &-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .header {
      flex-shrink: 0;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 24px;
      padding-right: 24px;
      box-shadow: 0 8px 24px -2px rgb(0 0 0 / 5%);
      z-index: 501;
    }

    .main {
      padding: 24px;
      flex: 1;
      background-color: #eef0f3;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>

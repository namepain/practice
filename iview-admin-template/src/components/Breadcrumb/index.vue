<template>
  <Breadcrumb class="app-breadcrumb">
    <transition-group name="breadcrumb" tag="a">
      <BreadcrumbItem v-for="(item,index) in levelList" v-if="item.meta.title" :key="item.path">
        <template slot="separator">/</template>
        <span v-if="item.redirect === 'noredirect' || index === levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <router-link v-else :to="item.redirect || item.path">{{ item.meta.title }}</router-link>
      </BreadcrumbItem>
    </transition-group>
  </Breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style lang="less" scoped>
  .app-breadcrumb.ivu-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    > a > span:last-child {
      /deep/ .ivu-breadcrumb-item-separator {
        display: none;
      }
    }
  }
</style>

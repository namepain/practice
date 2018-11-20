<template>
  <div class="scrollbar-wrapper">
    <div>
      <transition name="collapse-in" mode="out-in">
        <Menu
          v-show="!isCollapse"
          @on-select="handleSelect"
          :active-name="$route.path"
          width="180"
          mode="vertical"
          accordion
        >
          <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"/>
        </Menu>
      </transition>
      <transition name="collapse-out" mode="in-out">
        <div class="menu-collapsed" v-show="isCollapse">
          <CollapseMenu
            v-for="route in routes"
            :key="`drop-menu-${route.name}`"
            @on-click="handleSelect"
            :item="route"
            :base-path="route.path"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import CollapseMenu from './CollapseMenu'
import { validateURL } from '@/common/utils/validate'

export default {
  components: { SidebarItem, CollapseMenu },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() { // 过滤 hidden 和没有 children 的路由
      return this.$router.options.routes.filter(v => (!v.hidden && v.children))
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    handleSelect(path) {
      console.log(path)
      if (validateURL(path)) {
        window.open(path)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

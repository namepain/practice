<template>
  <Tooltip
    v-if="hasOneShowingChild(item.children) && !onlyOneChild.children && !item.alwaysShow"
    :key="`drop-menu-${item.name}`"
    :content="getTooltipContent(item)"
    placement="right">
      <a
        @click="handleClick(resolvePath(onlyOneChild.path))"
        class="drop-menu-a"
        >
        <svg-icon v-if="item.meta || item.children" :icon-class="getTooltipIcon(item)"/>
      </a>
  </Tooltip>
  <dropdownMenu
    v-else
    :item="item"
    :base-path="resolvePath(item.path)"
    :click="handleClick"
    hideTitle
  >
  </dropdownMenu>
</template>

<script>
import mixin from './mixin'
import dropdownMenu from './dropdownMenu'

export default {
  name: 'CollapseMenu',
  components: { dropdownMenu },
  mixins: [mixin],
  methods: {
    handleClick(path) {
      this.$emit('on-click', path)
    },
    getTooltipContent(item) {
      if (item.meta && item.meta.title) {
        return item.meta.title
      } else if (item.children && item.children[0] && item.children[0].meta) {
        return item.children[0].meta.title
      }
    },
    getTooltipIcon(item) {
      if (item.meta && item.meta.icon) {
        return item.meta.icon
      } else if (item.children && item.children[0] && item.children[0].meta) {
        return item.children[0].meta.icon
      }
    }
  }
}
</script>

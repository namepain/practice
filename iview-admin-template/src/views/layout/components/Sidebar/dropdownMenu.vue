<template>
  <Dropdown
    class="dropdown-menu"
    placement="right-start"
    @on-click="click"
    trigger="click"
  >
    <Item :icon="item.meta.icon" :title="hideTitle ? '' : item.meta.title" :hasChild="!!(!hideTitle && item.children && item.children.length)"/>
    <DropdownMenu slot="list">
      <template v-for="child in item.children">
        <DropdownItem
          v-if="!child.children"
          :key="`drop-${child.name}`"
          :name="resolvePath(child.path)">
            <Item :icon="child.meta.icon" :title="child.meta.title" />
        </DropdownItem>
        <dropdownMenu
          v-else
          :key="`drop-${child.name}`"
          :base-path="resolvePath(child.path)"
          :item="child" />
      </template>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'dropdownMenu',
  mixins: [mixin],
  props: {
    click: {
      type: Function,
      default: () => {}
    },
    hideTitle: {
      type: Boolean,
      default: false
    }
  }
}
</script>

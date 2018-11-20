<template>
  <div class="menu-wrapper">

    <template v-if="hasOneShowingChild(item.children) && !onlyOneChild.children && !item.alwaysShow">
      <!-- <a :href="onlyOneChild.path" target="_blank" @click="clickLink(onlyOneChild.path,$event)"> -->
        <menu-item :name="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title" />
        </menu-item>
      <!-- </a> -->
    </template>

    <Submenu v-else :name="item.name || item.path">
      <template slot="title" v-if="item.meta">
        <item :icon="item.meta.icon" :title="item.meta.title" />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children && child.children.length"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"/>

        <!-- <a v-else :href="child.path" :key="child.name" target="_blank" @click="clickLink(child.path, $event)"> -->
          <menu-item v-else :key="child.name" :name="resolvePath(child.path)">
            <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
          </menu-item>
        <!-- </a> -->
      </template>
    </Submenu>

  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'SidebarItem',
  mixins: [mixin]
}
</script>

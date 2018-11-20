import path from 'path'
import { validateURL } from '@/common/utils/validate'
import Item from './Item'

export default {
  components: { Item },
  props: {
    // route配置json
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    /**
     * 显示一级目录逻辑：
     * 1、只有一个可见的 子菜单
     * 2、子菜单没有子菜单
     * 3、没有配置 alwaysShow
     */
    hasOneShowingChild(children) {
      if (!children) return false
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      return showingChildren.length === 1
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    }
  }
}

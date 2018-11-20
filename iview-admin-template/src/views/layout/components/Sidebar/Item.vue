<script>
import { Icon } from 'iview'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    hasChild: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { icon, title, hasChild } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }
    if (title) {
      vnodes.push(<span>{(title)}</span>)
    }
    if (hasChild) {
      vnodes.push(<Icon style="float: right;" type="ios-arrow-forward" size={16}/>)
    }
    return vnodes
  }
}
</script>

import { throttle } from 'throttle-debounce'
import { getSize } from '@/utils/dom'

export default {
  props: {
    'is-responsive': {
      type: Boolean,
      default: true
    },
    layout: String,
    'default-span': Number,
    'label-position': String,
    breakpoint: Array
  },
  data() {
    return {
      defaultLabelPosition: 'right',
      parentElWidth: 0,
      defaultBreakpoints: {
        vertical: [
          [513, 1, 'vertical'],
          [785, 2, 'vertical'],
          [1057, 3, 'vertical'],
          [Infinity, 4, 'vertical']
        ],
        default: [
          [513, 1, 'horizontal'],
          [701, 2, 'horizontal'],
          [1062, 2, 'horizontal'],
          [1352, 3, 'horizontal'],
          [Infinity, 4, 'horizontal']
        ]
      }
    }
  },
  computed: {
    computedIsResponsive() {
      return this.inline && this.isResponsive
    },
    computedLabelPosition() {
      const labelPosition = this.labelPosition
      return labelPosition || this.defaultLabelPosition
    },
    colLayout() {
      return this.breakpoint
        ? this.breakpoint.map(item => [
            item[0],
            this.layoutSpan / item[1],
            'horizontal'
          ])
        : this.defaultBreakpoints[this.layout || 'default']
    },
    computedSpan() {
      if (this.defaultSpan) {
        return this.defaultSpan
      } else if (this.computedIsResponsive) {
        let breakPoint = (
          this.colLayout || this.defaultBreakpoints.default
        ).find(item => this.parentElWidth < item[0])
        return breakPoint[1]
      }
    }
  },
  methods: {
    handleWindowResize() {
      if (!this.$refs.wrapper) return
      let { clientWidth } = this.$refs.wrapper
      if (clientWidth === 0 && this.$refs.wrapper instanceof Element) {
        clientWidth = getSize(this.$refs.wrapper).width
      }

      this.parentElWidth = clientWidth
    },

    startResponsive() {
      this.$nextTick(() => {
        this.handleWindowResize()

        this.resizeFn = throttle(150, this.handleWindowResize)
        window.addEventListener('resize', this.resizeFn, false)
      })
    },

    endResponsive() {
      window.removeEventListener('resize', this.resizeFn, false)
    }
  },
  mounted() {
    if (this.computedIsResponsive) {
      this.startResponsive()
    }
  },
  beforeDestroy() {
    if (this.computedIsResponsive) {
      this.endResponsive()
    }
  }
}

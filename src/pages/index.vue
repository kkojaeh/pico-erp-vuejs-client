<template>
  <q-page class="fit">
    <grid-layout
        :layout="portlets"
        :col-num="cols"
        :row-height="60"
        :is-draggable="true"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        @layout-updated="_onLayoutUpdated">
      <grid-item v-for="item in portlets"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i">
        <component :is="item.component"></component>
      </grid-item>
    </grid-layout>
    <q-resize-observable @resize="_onResize"/>
  </q-page>
</template>

<style>
</style>

<script>
  import {GridItem, GridLayout} from 'vue-grid-layout'
  import {authenticate} from 'src/plugins/auth'
  import {portlets} from 'src/model/portlet'

  export default {
    name: 'PageIndex',
    data () {
      return {
        cols: 3,
        portlets: []
      }
    },
    async mounted () {
      const positions = JSON.parse(localStorage.getItem('INDEX/PORTLETS') || '{}')
      const targets = portlets.filter(portlet => authenticate(portlet.authorize))

      await Promise.all(targets.map(
        async (portlet) => {
          const position = positions[portlet.i]
          if (position) {
            portlet.x = position.x
            portlet.y = position.y
          }
          portlet.component = (await portlet.component).default
        })
      )

      this.portlets = targets
    },
    methods: {
      _onResize (size) {
        const width = size.width//document.body.offsetWidth
        if (width > 1200) {
          this.cols = 5
        } else if (width > 992) {
          this.cols = 4
        } else if (width > 768) {
          this.cols = 3
        } else if (width > 576) {
          this.cols = 2
        } else {
          this.cols = 1
        }
      },
      _onLayoutUpdated (newLayout) {
        const positions = {}
        newLayout.forEach(layout => {
          positions[layout.i] = {
            x: layout.x,
            y: layout.y
          }
        })
        localStorage.setItem('INDEX/PORTLETS', JSON.stringify(positions))
        //console.log(localStorage.getItem('INDEX/PORTLETS'))
      }
    },
    computed: {},
    watch: {},
    components: {
      GridItem,
      GridLayout
    }
  }
</script>

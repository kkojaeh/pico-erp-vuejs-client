<template>
  <q-layout ref="layout" view="lHh Lpr fFf">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat @click="_toggle()" v-if="!!user">
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title>
          {{title}}
          <a v-show="!!helpLink" :href="helpLink" target="_blank">
            <q-icon name="help" class="q-ml-sm"></q-icon>
          </a>
          <div slot="subtitle">Version : {{$version}}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer v-model="drawerOpened">
      <q-card color="primary" flat v-if="user" class="auth-card">
        <q-card-title>
          {{ user.displayName }}
          <span slot="subtitle">{{ user.email }}</span>
        </q-card-title>
        <q-card-separator/>
        <q-card-actions align="between">
          <router-link to="/">
            <q-btn small round flat icon="home"/>
          </router-link>
          <div>
            <router-link to="/my">
              <q-btn small round flat icon="person"/>
            </router-link>
            <q-btn small round flat icon="exit_to_app" @click="_onSignOutClick()"/>
          </div>
        </q-card-actions>
      </q-card>

      <q-list separator no-border link inset-delimiter>
        <!-- collapsible to hide sub-level menu entries -->

        <q-collapsible v-for="menu in menus" :icon="menu.icon" :label="menu.label"
                       :key="menu.id"
                       v-if="menu.children && menu.children.length" opened>
          <router-link :to="child.url" v-for="child in menu.children" :key="child.id">
            <q-item>
              <q-item-side :icon="child.icon"/>
              <q-item-main :label="child.label"/>
            </q-item>
          </router-link>

        </q-collapsible>

      </q-list>
    </q-layout-drawer>
    <q-page-container :style="pageContainerComputedStyle">
      <router-view/>
    </q-page-container>
    <q-resize-observable @resize="_onResize"/>
  </q-layout>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {QLayoutFooter, QToolbar} from 'quasar'
  import Router from 'src/router'

  /*
   * Root component
   */
  export default {
    components: {
      QToolbar,
      QLayoutFooter
    },
    data () {
      return {
        drawerOpened: this.$q.platform.is.desktop,
        paddingBottom: 0
      }
    },
    methods: {
      _toggle () {
        this.drawerOpened = !this.drawerOpened
      },
      async _onSignOutClick () {
        const ok = await this.$alert.confirm('로그아웃 하시겠습니까?')
        if (ok) {
          try {
            await this.$auth.signOut()
          } catch(e) {
            this.$alert.negative('로그아웃중 오류 발생')
          }
          this.$router.push('/sign-in')
        }
      },
      _onResize (size) {
        const el = this.$el
        let bottom = 0
        Array.from(el.querySelectorAll('.fixed-bottom')).forEach(e => {
          bottom += e.offsetHeight
        })
        this.paddingBottom = bottom
      }
    },
    created () {
      Router.afterEach(this._onResize)
    },
    computed: {
      ...mapGetters({
        title: 'global/title',
        helpLink: 'global/helpLink',
        user: 'auth/user',
        menus: 'auth/menus'
      }),
      pageContainerComputedStyle () {
        return {
          'padding-bottom': `${this.paddingBottom}px`
        }
      }
    }
  }
</script>

<style>
  .auth-card {
    margin: 8px;
  }

  .q-layout-page-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: auto;
  }

  /*



  */
</style>

<template>
  <q-layout ref="layout" view="lHh Lpr lff">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat @click="_toggle()" v-if="!!user">
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title>
          {{title}}
          <div slot="subtitle">Running on Quasar v{{$q.version}}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer v-model="drawerOpend">
      <q-card color="primary" flat v-if="user" class="auth-card">
        <q-card-title>
          {{ user.displayName }}
          <span slot="subtitle">{{ user.email }}</span>
        </q-card-title>
        <q-card-separator/>
        <q-card-actions align="end">
          <q-btn small round flat>
            <q-icon name="person"/>
          </q-btn>
          <q-btn small round flat @click="_onSignOutClick()">
            <q-icon name="exit_to_app"/>
          </q-btn>
        </q-card-actions>
      </q-card>

      <q-list separator no-border link inset-delimiter>
        <!-- collapsible to hide sub-level menu entries -->

        <q-collapsible v-for="menu in menus" :icon="menu.icon" :label="menu.name"
                       :key="menu.id"
                       v-if="menu.children && menu.children.length" opened>
          <router-link :to="child.url" v-for="child in menu.children" :key="child.id">
            <q-item>
              <q-item-side :icon="child.icon"/>
              <q-item-main :label="child.name"/>
            </q-item>
          </router-link>

        </q-collapsible>

      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Toast from 'quasar'

  /*
   * Root component
   */
  export default {
    created () {
    },
    computed: {
      ...mapGetters({
        title: 'global/title',
        user: 'auth/user',
        menus: 'auth/menus'
      })
    },
    components: {},
    data () {
      return {
        drawerOpend: this.$q.platform.desktop
      }
    },
    methods: {
      _toggle () {
        this.drawerOpend = !this.drawerOpend
      },
      _onSignOutClick () {
        this.$alert.confirm('로그아웃 하시겠습니까?').then((ok) => {
          if (ok) {
            this.$auth.signOut().then(() => {
              this.$router.push('/sign-in')
            }).catch(() => {
              this.$alert.negative('로그아웃중 오류 발생')
            })
          }
        })
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
  }

  .q-layout-page-container > * {
    height: 100%;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    text-decoration: wavy;
  }
</style>

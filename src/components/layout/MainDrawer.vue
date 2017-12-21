<template>
  <div>
    <q-card color="primary" flat v-if="user">
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

      <q-collapsible v-for="menu in grantedMenus" :icon="menu.icon" :label="menu.name"
                     :key="menu.id"
                     v-if="menu.children && menu.children.length" opened>
        <q-side-link link item :to="child.url" v-for="child in menu.children" :key="child.id">
          <q-item>
            <q-item-side :icon="child.icon"/>
            <q-item-main :label="child.name"/>
          </q-item>
        </q-side-link>

      </q-collapsible>

    </q-list>
  </div>
</template>
<script>
  import Toast from 'quasar';
  import {mapGetters} from 'vuex';
  import * as auth from 'src/config/auth';
  import {confirm} from 'src/util';

  export default {
    data() {
      return {};
    },
    created() {
    },
    methods: {
      _onSignOutClick() {
        confirm('로그아웃 하시겠습니까?').then((ok) => {
          if (ok) {
            auth.signOut().then(() => {
              this.$router.push('/sign-in');
            }).catch(() => {
              Toast.create.negative('로그아웃중 오류 발생');
            });
          }
        });
      }
    },
    computed: {
      ...mapGetters(['user', 'grantedMenus'])
    },
    mounted() {

    }
  };
</script>
<style>

</style>

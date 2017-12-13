<template>
  <div>
    <q-card color="primary" flat v-if="authenticated">
      <q-card-title>
        {{ user.displayName }}
        <span slot="subtitle">{{ user.email }}</span>
      </q-card-title>
      <q-card-separator/>
      <q-card-actions align="end">
        <q-btn small round flat>
          <q-icon name="person"/>
        </q-btn>
        <q-btn small round flat @click="signOut ()">
          <q-icon name="exit_to_app"/>
        </q-btn>
      </q-card-actions>
    </q-card>

    <!--
      Use <q-side-link> component
      instead of <q-item> for
      internal vue-router navigation
    -->

    <q-list no-border link inset-delimiter>
      <q-list-header></q-list-header>
      <q-side-link item to="/user">
        <q-item-side icon="account circle"/>
        <q-item-main label="사용자 관리" sublabel="사용자의 추가/수정/삭제"/>
      </q-side-link>
      <q-item @click="launch('http://quasar-framework.org')">
        <q-item-side icon="school"/>
        <q-item-main label="Docs" sublabel="quasar-framework.org"/>
      </q-item>
      <q-item @click="launch('http://forum.quasar-framework.org')">
        <q-item-side icon="record_voice_over"/>
        <q-item-main label="Forum" sublabel="forum.quasar-framework.org"/>
      </q-item>
      <q-item @click="launch('https://gitter.im/quasarframework/Lobby')">
        <q-item-side icon="chat"/>
        <q-item-main label="Gitter Channel" sublabel="Quasar Lobby"/>
      </q-item>
      <q-item @click="launch('https://twitter.com/quasarframework')">
        <q-item-side icon="rss feed"/>
        <q-item-main label="Twitter" sublabel="@quasarframework"/>
      </q-item>
      <q-item @click="route('/field')">
        <q-item-side icon="rss feed"/>
        <q-item-main label="Field" sublabel="@quasarframework">
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import firebase from 'firebase';
  import Toast from 'quasar';

  export default {
    data() {
      return {};
    },
    created() {
    },
    methods: {
      signOut() {
        firebase.auth().signOut().then(() => {
          this.$router.push('/sign-in');
        }).catch(() => {
          Toast.create.negative('로그아웃중 오류 발생');
        });
      }
    },
    computed: {
      ...mapGetters(['user', 'authenticated'])
    }
  };
</script>
<style>

</style>

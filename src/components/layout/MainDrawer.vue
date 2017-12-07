<template>
  <div>
    <!--
      Use <q-side-link> component
      instead of <q-item> for
      internal vue-router navigation
    -->

    <q-list no-border link inset-delimiter>
      <q-list-header>Essential Links</q-list-header>
      <q-side-link to="/user">
        <q-item>
          <q-item-side icon="account circle"/>
          <q-item-main label="사용자 관리" sublabel=""/>
        </q-item>
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
  import { mapGetters } from 'vuex'
  // import firebase from 'firebase'

  export default {
    data () {
      return {}
    },
    created () {
    },
    methods: {
      logOut () {
      }
    },
    computed: {
      ...mapGetters(['isFrameNeeded', 'isAuthenticated'])
    }
  }
</script>
<style scoped>
  .fixed-bottom {
    margin-bottom: 1%;
  }

  .fixed-bottom a img {
    width: 25px;
    height: 25px;
  }

  #avatar {
    padding: 20px;
  }

  #profile {
    height: 130px;
    background-color: #009688;
  }

  #user-name {
    left: 90px;
    bottom: 77px;
    position: relative;
    width: 159px;
  }

  #user-actions {
    left: 90px;
    bottom: 71px;
    position: relative;
    width: 171px;
  }

  #menu-collapse {
    margin-top: 5%;
  }
</style>

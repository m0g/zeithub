<template>
  <v-app>
    <v-navigation-drawer permanent app clipped class="transparent" floating>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Zeithub
          </v-list-item-title>
          <v-list-item-subtitle> v{{ version }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list dense nav>
        <router-link to="/time" v-if="isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Time Tracking
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/projects" v-if="isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Projects
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/clients" v-if="isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Clients
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/expenses" v-if="isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-cash-register</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Expenses
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/invoices" v-if="isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-file-document-box-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Invoices
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/me" v-if="isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Profile
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/signin" v-if="!isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Sign-in
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/signup" v-if="!isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Sign-up
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/signout" v-if="isLoggedIn">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Sign-out
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <router-view id="router-view"></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { version } from './../../../package.json';
import { isLoggedIn, signOut } from './../auth';
import http from './../http';

@Component({})
export default class App extends Vue {
  version: string = version;
  isLoggedIn: Boolean = isLoggedIn();

  created() {
    http('/api/me')
      .then(data => data.json())
      .then(data => {
        if (data.auth === false && isLoggedIn()) {
          signOut();
          setTimeout(() => (window.location.href = '/'), 1000);
        }
      });
  }
}
</script>

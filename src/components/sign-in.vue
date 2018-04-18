<template>
  <fieldset>
    <legend>Sign-in</legend>
    <form @submit="signIn" method="post">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <input
          type="text"
          placeholder="User name"
          v-model="username" />
      </p>
      <p>
        <input
          type="password"
          placeholder="Password"
          v-model="password" />
      </p>
      <p><input type="submit" value="Send" /></p>
    </form>
  </fieldset>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        errors: [],
      };
    },

    methods: {
      signIn(e) {
        e.preventDefault();

        if (!this.username) {
          this.errors.push('Username is required');
        }

        if (!this.password) {
          this.errors.push('Password is required');
        }

        if (this.errors.length === 0) {
          const user = {
            username: this.username,
            password: this.password
          };

          fetch('/api/sign/in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          })
            .then(response => response.json())
            .then(response => {
              console.log(response);
            });
        }
      }
    }
  };
</script>

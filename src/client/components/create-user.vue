<template>
  <fieldset>
    <form @submit="sendForm" method="post">
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
      <p>
        <input
          type="password"
          placeholder="Repeat password"
          v-model="passwordRepeat" />
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
        passwordRepeat: '',
        errors: []
      };
    },

    methods: {
      sendForm(e) {
        this.errors = [];
        e.preventDefault();

        if (!this.username) {
          this.errors.push('Username is required');
        }

        if (!this.password || !this.passwordRepeat) {
          this.errors.push('Password is required');
        } else if (this.password !== this.passwordRepeat) {
          this.errors.push('Passwords don\'t match');
        }

        if (this.errors.length === 0) {
          const user = {
            name: this.username,
            password: this.password
          };

          fetch('/api/users', {
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

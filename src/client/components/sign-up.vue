<template>
  <fieldset>
    <legend>Sign up</legend>
    <form @submit="signUp" method="post">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
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
          type="text"
          placeholder="Email"
          v-model="email" />
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
    <p>How to write a password:</p>
    <a href="https://xkcd.com/936/" target="_blank">
      <img src="https://imgs.xkcd.com/comics/password_strength.png" />
    </a>
  </fieldset>
</template>
<script>
  export default {
    data() {
      return {
        email: '',
        username: '',
        password: '',
        passwordRepeat: '',
        errors: []
      };
    },

    methods: {
      signUp(e) {
        this.errors = [];
        e.preventDefault();

        if (!this.username) {
          this.errors.push('Username is required');
        }

        if (!this.email) {
          this.errors.push('Email is required');
        }

        if (!this.password || !this.passwordRepeat) {
          this.errors.push('Password is required');
        } else if (this.password !== this.passwordRepeat) {
          this.errors.push('Passwords don\'t match');
        }

        if (this.errors.length === 0) {
          const user = {
            username: this.username,
            password: this.password,
            email: this.email,
          };

          fetch('/api/sign/up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          })
            .then(response => response.json())
            .then(response => {
              if (response.success === true) {
                localStorage.setItem('token', response.token);
                window.location.href = '/';
              }
            });
        }
      }
    }
  };
</script>

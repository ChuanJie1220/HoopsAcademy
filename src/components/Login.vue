<template>
  <div class="d-flex flex-column gap-5">
    <div class="login-container-header">
      <div class="d-flex flex-row align-items-center">
        <img src="@/assets/ComLogo.png" alt="Logo" width="175px" height="175px" />
        <h1>The Hoops Academy</h1>
      </div>
      <div class="d-flex flex-row align-items-end">
        <p>Follow us on</p>
        <div class="icons">
          <a href="https://www.facebook.com" target="_blank" class="icon">
            <i class="bi bi-facebook me-2 fs-3"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" class="icon">
            <i class="bi bi-instagram me-2 fs-3"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center" style="margin-bottom: 30px">
      <div class="d-flex flex-column" style="width: 375px; gap: 20px; padding: 10px">
        <div class="d-flex flex-row justify-content-between">
          <p>LOGIN</p>
          <a href="/register" class="d-flex flex-row align-items-center">
            <p>Register Account</p>
            <img src="@/assets/Chevron Right.png" alt="Logo" width="20px" height="20px" />
          </a>
        </div>
        <hr style="border-top: 3px solid #333; opacity: 1; margin: 0px" />
        <p>Please key in your username or email and password to login.</p>

        <div class="d-flex flex-column w-100 gap-3">
          <img src="@/assets/login-username.png" alt="Logo" width="50px" height="50px" style="align-self: center" />
          <div>
            <b-form-input :state="usernameOrEmailErr" v-model="usernameOrEmail" placeholder="Username or Email" trim
              type="text"></b-form-input>
            <b-form-invalid-feedback class="error-message">
              This field is required
            </b-form-invalid-feedback>
          </div>
        </div>

        <div class="d-flex flex-column w-100 gap-3">
          <img src="@/assets/login-password.png" alt="Logo" width="50px" height="50px" style="align-self: center" />
          <div style="position: relative">
            <b-form-input :state="passwordErr" v-model="password" placeholder="Password" trim
              :type="show ? 'text' : 'password'"></b-form-input>
            <b-form-invalid-feedback class="error-message">
              This field is required
            </b-form-invalid-feedback>
            <img @click="showPassword" :style="{
              position: 'absolute',
              top: '9px',
              right: passwordErr !== null ? '35px' : '10px',
              cursor: 'pointer',
            }" src="@/assets/password-show.png" alt="Show Password" width="20px" height="20px" />
          </div>
        </div>

        <a style="text-align: right;" href="/forgot-password">Forgot Password</a>
        <div>
          <b-button class="w-100" @click="login">Login</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store';
export default {
  name: "loginPage",
  data() {
    return {
      show: false,
      usernameOrEmail: "", 
      password: "",
      usernameOrEmailErr: null,
      passwordErr: null,
    };
  },
  methods: {
    showPassword() {
      this.show = !this.show;
    },
    async login() {
      this.usernameOrEmailErr = this.usernameOrEmail ? null : false;
      this.passwordErr = this.password ? null : false;

      if (!this.usernameOrEmail || !this.password) return;

      try {
        let dataToPost = {
          usernameOrEmail: this.usernameOrEmail, // Use the updated field
          password: this.password,
        };

        const res = await this.$axios.post('login', dataToPost);
        let user = res.data.user;
        console.log('res', res)

        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('isLogin', true);

        store.user = user;
        store.isLogin = true;
        console.log('store', store)

        if (res.data) {
          this.$showSuccess('success', 'Login Successful', `Welcome <b>${store.user.username}</b>`).then(() => { this.$router.push('/') });
        }
      } catch (err) {
        let errorMessage = err.response?.data?.error || "An unexpected error occurred";
        this.$showSuccess('error', 'Login Failed', errorMessage);
      }
    },
  },
};
</script>

<style scoped>
.login-container-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  color: #000;
  background-color: #68747afa;
  flex-wrap: wrap;
  padding: 10px;
}

p {
  margin: 0px;
}

.icons {
  display: flex;
  gap: 10px;
}

.icon {
  color: white;
  font-size: 20px;
  text-decoration: none;
}

.icon:hover {
  color: #f0ad4e;
  /* e.g., golden tone or your brand color */
  transition: color 0.3s ease;
}
</style>

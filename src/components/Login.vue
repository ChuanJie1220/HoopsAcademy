<template>
  <div class="d-flex flex-column gap-5">
    <div class="login-container-header">
      <div class="d-flex flex-row align-items-center">
        <img
          src="@/assets/ComLogo.png"
          alt="Logo"
          width="175px"
          height="175px"
        />
        <h1>The Hoops Academy</h1>
      </div>
      <div class="d-flex flex-row align-items-end">
        <p>Follow us on</p>
        <img src="@/assets/ComLogo.png" alt="Logo" width="50px" height="50px" />
        <img src="@/assets/ComLogo.png" alt="Logo" width="50px" height="50px" />
      </div>
    </div>
    <div class="d-flex justify-content-center" style="margin-bottom: 30px">
      <div
        class="d-flex flex-column"
        style="width: 375px; gap: 20px; padding: 10px"
      >
        <div class="d-flex flex-row justify-content-between">
          <p>LOGIN</p>
          <a href="/home" class="d-flex flex-row align-items-center"
            ><p>Register Account</p>
            <img
              src="@/assets/Chevron Right.png"
              alt="Logo"
              width="20px"
              height="20px"
            />
          </a>
        </div>
        <hr style="border-top: 3px solid #333; opacity: 1; margin: 0px" />
        <p>Please key in your username and password to login.</p>
        <div class="d-flex flex-column w-100 gap-3">
          <img
            src="@/assets/login-username.png"
            alt="Logo"
            width="50px"
            height="50px"
            style="align-self: center"
          />
          <div>
            <b-form-input
              :state="emailErr"
              v-model="email"
              placeholder="Username or Email"
              trim
              type="text"
            ></b-form-input>
            <b-form-invalid-feedback class="error-message">
              This field is required
            </b-form-invalid-feedback>
          </div>
        </div>
        <div class="d-flex flex-column w-100 gap-3">
          <img
            src="@/assets/login-password.png"
            alt="Logo"
            width="50px"
            height="50px"
            style="align-self: center"
          />
          <div style="position: relative">
            <b-form-input
              :state="passwordErr"
              v-model="password"
              placeholder="Password"
              trim
              :type="show ? 'text' : 'password'"
            ></b-form-input>
            <b-form-invalid-feedback class="error-message">
              This field is required
            </b-form-invalid-feedback>
            <img
              @click="showPassword"
              :style="{
                position: 'absolute',
                top: '9px',
                right: passwordErr !== null ? '35px' : '10px',
                cursor: 'pointer',
              }"
              src="@/assets/password-show.png"
              alt="Logo"
              width="20px"
              height="20px"
            />
          </div>
        </div>
        <a href="/home">Forgot Password</a>
        <div>
          <b-button class="w-100" @click="login">Login</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "login",
  components: {},
  computed: {},
  data: function () {
    return {
      show: false,
      email: "",
      password: "",
      emailErr: null,
      passwordErr: null,
    };
  },
  props: {},
  methods: {
    showPassword() {
      this.show = !this.show;
    },
    async login() {
      !this.email ? (this.emailErr = false) : (this.emailErr = true);
      !this.password ? (this.passwordErr = false) : (this.passwordErr = true);
      if (this.email && this.password) {
        let dataToPost = {
          email: this.email,
          password: this.password,
        };
        let res = await this.$axios.post('login', dataToPost)
        console.log('res', res)
      }
    },
  },
  mounted() {},
  watch: {},
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
</style>

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
          <p>REGISTER ACCOUNT</p>
          <a href="/login" class="d-flex flex-row align-items-center">
            <p>Login</p>
            <img src="@/assets/Chevron Right.png" alt="Logo" width="20px" height="20px" />
          </a>
        </div>
        <hr style="border-top: 3px solid #333; opacity: 1; margin: 0px" />
        <p>Please fill up the field below.</p>
        <div class="d-flex flex-column w-100 gap-3">
          <img src="@/assets/login-username.png" alt="Logo" width="50px" height="50px" style="align-self: center" />
          <div>
            <b-form-input :state="usernameErr" v-model="username" placeholder="Username" trim
              type="text"></b-form-input>
            <b-form-invalid-feedback v-if="errors.username" class="error-message">
              {{ errors.username[0] }}
            </b-form-invalid-feedback>
          </div>
        </div>
        <div class="d-flex flex-column w-100 gap-3">
          <div>
            <b-form-input :state="emailErr" v-model="email" placeholder="Email" trim type="text"></b-form-input>
            <b-form-invalid-feedback v-if="errors.email" class="error-message">
              {{ errors.email[0] }}
            </b-form-invalid-feedback>
          </div>
        </div>
        <div class="d-flex flex-column w-100 gap-3">
          <div>
            <b-form-input :state="phoneNoErr" v-model="phoneNo" placeholder="Phone Number" trim
              type="text"></b-form-input>
            <b-form-invalid-feedback v-if="errors.phoneNo" class="error-message">
              {{ errors.phoneNo[0] }}
            </b-form-invalid-feedback>
          </div>
        </div>
        <div class="col-md-6">
          <b-form-select v-model="selectedGender" :options="gender" class="">
            <option value="">Gender (Optional)</option>
          </b-form-select>
        </div>
        <div class="d-flex flex-column w-100 gap-3">
          <div style="position: relative">
            <b-form-input :state="passwordErr" v-model="password" placeholder="Password" trim
              :type="showPwd ? 'text' : 'password'"></b-form-input>
            <b-form-invalid-feedback v-if="errors.password" class="error-message">
              {{ errors.password[0] }}
            </b-form-invalid-feedback>
            <img @click="showPassword" :style="{
              position: 'absolute',
              top: '9px',
              right: passwordErr !== null ? '35px' : '10px',
              cursor: 'pointer',
            }" src="@/assets/password-show.png" alt="Logo" width="20px" height="20px" />
          </div>
        </div>
        <div class="d-flex flex-column w-100 gap-3">
          <div style="position: relative">
            <b-form-input :state="confirmPasswordErr" v-model="confirmPassword" placeholder="Confirm password" trim
              :type="showConfirmPwd ? 'text' : 'password'"></b-form-input>

            <b-form-invalid-feedback v-if="errors.confirmPassword" class="error-message">
              {{ errors.confirmPassword[0] }}
            </b-form-invalid-feedback>

            <img @click="showConfirmPassword" :style="{
              position: 'absolute',
              top: '9px',
              right: passwordErr !== null ? '35px' : '10px',
              cursor: 'pointer',
            }" src="@/assets/password-show.png" alt="Logo" width="20px" height="20px" />
          </div>
        </div>
        <div>
          <b-button class="w-100" @click="register">Register</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "register",
  components: {},
  computed: {},
  data: function () {
    return {
      showPwd: false,
      showConfirmPwd: false,
      username: "",
      email: "",
      phoneNo: "",
      password: "",
      confirmPassword: "",
      usernameErr: null,
      emailErr: null,
      phoneNoErr: null,
      passwordErr: null,
      confirmPasswordErr: null,
      selectedGender: "",
      gender: [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Other', text: 'Prefer Not to Disclose' },
      ],
      errors: {}
    };
  },
  props: {},
  methods: {
    showPassword() {
      this.showPwd = !this.showPwd;
    },
    showConfirmPassword() {
      this.showConfirmPwd = !this.showConfirmPwd;
    },
    checkInputError() {
      if (this.username == '' || this.errors.username) {
        this.usernameErr = false;
      }
      else {
        this.usernameErr = true;
      }
      if (this.email == '' || this.errors.email) {
        this.emailErr = false;
      }
      else {
        this.emailErr = true;
      }
      if (this.phoneNo == '' || this.errors.phoneNo) {
        this.phoneNoErr = false;
      }
      else {
        this.phoneNoErr = true;
      }
      if (this.password == '' || this.errors.password) {
        this.passwordErr = false;
      }
      else {
        this.passwordErr = true;
      }
      if (this.confirmPassword == '' || this.errors.confirmPassword) {
        this.confirmPasswordErr = false;
      }
      else {
        this.confirmPasswordErr = true;
      }
      console.log('err', this.errors.password)
      // if (this.confirmPassword === '') {
      //   this.confirmPasswordErr = false;
      // } else if (this.confirmPassword !== this.password) {
      //   this.confirmPasswordErr = false; // Mark error if passwords don't match
      // } else {
      //   this.confirmPasswordErr = true; // Mark valid if they match
      // }
    },
    async register() {
      let dataToPost = {
        username: this.username,
        email: this.email,
        phoneNo: this.phoneNo,
        gender: this.selectedGender,
        password: this.password,
        confirmPassword: this.confirmPassword,
      };

      try {
        let result = await this.$axios.post('signup', dataToPost);
        console.log('Sign Up result', result);
        this.$showSuccess('success', 'User Registered Successfully').then(() => { this.$router.push('/login') });
      } catch (error) {
        console.log('error', error);

        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.error;
          this.checkInputError();
          console.log('Sign Up error', error.response.data.error);
        }
      }
    }
  },
  mounted() { },
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
  transition: color 0.3s ease;
}
</style>

<template>
  <div class="" style="padding: 30px">
    <div class="d-flex flex-row">
      <!-- <h1>Profile</h1> -->
      <div class="d-flex flex-row gap-3 align-items-center justify-content-center w-100">
        <b-nav tabs justified v-if="isAdmin">
          <b-nav-item :to="{ path: '/profile' }" exact active-class="active-tab">Profile</b-nav-item>
          <b-nav-item :to="{ path: '/orderManagement' }" exact active-class="active-tab">Orders</b-nav-item>
          <b-nav-item :to="{ path: '/favourite' }" exact active-class="active-tab">Favourites</b-nav-item>
          <b-nav-item :to="{ path: '/userManagement' }" exact active-class="active-tab">User Management</b-nav-item>
        </b-nav>
        <b-nav tabs justified v-else>
          <b-nav-item :to="{ path: '/profile' }" exact active-class="active-tab">Profile</b-nav-item>
          <b-nav-item :to="{ path: '/orderManagement' }" exact active-class="active-tab">Orders</b-nav-item>
          <b-nav-item :to="{ path: '/favourite' }" exact active-class="active-tab">Favourites</b-nav-item>
        </b-nav>
      </div>
    </div>
    <h1 class="caption">Profile</h1>
    <div class="user-account-info-container">
      <div class="user-container-info-container-header">
        <h1>User Account Information</h1>
      </div>
      <hr style="border-top: 3px solid #333; opacity: 1; margin: 0px" />
      <div class="user-account-info-content">
        <div style="width: 70%">
          <div class="user-account-info-content-left">
            <div class="d-flex justify-content-end mb-3 gap-3">
              <b-button v-if="!isChangePwd" @click="isEditing = !isEditing">
                {{ isEditing ? 'Cancel' : 'Edit Profile' }}
              </b-button>
              <b-button v-if="!isEditing" @click="isChangePwd = !isChangePwd">
                {{ isChangePwd ? 'Cancel' : 'Change Password' }}
              </b-button>
            </div>
            <div v-if="!isChangePwd" class="user-account-info-content-left-grid">
              <div>
                <label for="username">Username:</label>
                <b-form-input id="username" v-model="username" :readonly="!isEditing" placeholder="Enter your username"
                  trim></b-form-input>
              </div>
              <div>
                <label for="name">Name:</label>
                <b-form-input id="name" v-model="name" :readonly="!isEditing" placeholder="Enter your name"
                  trim></b-form-input>
              </div>
              <div>
                <label for="email">Email:</label>
                <b-form-input type="email" id="email" v-model="email" :readonly="!isEditing"
                  placeholder="Enter your email" trim></b-form-input>
              </div>
              <div>
                <label for="contact">Contact Number:</label>
                <b-form-input id="contact" v-model="contactNumber" :readonly="!isEditing"
                  placeholder="Enter your contact number" trim></b-form-input>
              </div>
            </div>
            <div v-if="isChangePwd">
              <div style="position: relative">
                <label for="old_password">Current Password:</label>
                <b-form-input :state="passwordErr" v-model="old_password" placeholder="Enter your current password" trim
                  :type="show ? 'text' : 'password'"></b-form-input>
                <b-form-invalid-feedback class="error-message">
                  {{ oldPasswordMsg }}
                </b-form-invalid-feedback>
                <img @click="showPassword" :style="{
                  position: 'absolute',
                  top: '33px',
                  right: passwordErr !== null ? '35px' : '10px',
                  cursor: 'pointer',
                }" src="@/assets/password-show.png" alt="Show Password" width="20px" height="20px" />
              </div>

              <div style="position: relative">
                <label for="new_password">New Password:</label>
                <b-form-input :state="newPasswordErr" v-model="new_password" placeholder="Enter your new password" trim
                  :type="showNew ? 'text' : 'password'"></b-form-input>
                <b-form-invalid-feedback class="error-message">
                  {{ newPasswordMsg }}
                </b-form-invalid-feedback>
                <img @click="showNewPassword" :style="{
                  position: 'absolute',
                  top: '33px',
                  right: newPasswordErr !== null ? '35px' : '10px',
                  cursor: 'pointer',
                }" src="@/assets/password-show.png" alt="Show Password" width="20px" height="20px" />
              </div>

              <div style="position: relative">
                <label for="new_passwordConfirmation">New Password Confirmation:</label>
                <b-form-input :state="passwordConfirmationErr" v-model="new_passwordConfirmation"
                  placeholder="Enter your new password confirmation" trim
                  :type="showConfirm ? 'text' : 'password'"></b-form-input>
                <b-form-invalid-feedback class="error-message">
                  {{ confirmPasswordMsg }}
                </b-form-invalid-feedback>
                <img @click="showPasswordConfirmation" :style="{
                  position: 'absolute',
                  top: '33px',
                  right: passwordConfirmationErr !== null ? '35px' : '10px',
                  cursor: 'pointer',
                }" src="@/assets/password-show.png" alt="Show Password" width="20px" height="20px" />
              </div>
            </div>
            <div v-if="!isChangePwd" class="d-flex flex-row gap-3 align-items-center">
              <label for="gender">Gender:</label>
              <div v-if="!isEditing">{{ temp_selectedGender }}</div>
              <b-form-select v-else v-model="temp_selectedGender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </b-form-select>
            </div>
            <div v-if="isEditing" class="mt-3">
              <b-button class="w-100" @click="saveChanges">Save Changes</b-button>
            </div>
            <div v-if="isChangePwd" class="mt-3">
              <b-button class="w-100" @click="updatePwd">Update Password</b-button>
            </div>
          </div>
        </div>
        <div style="border-left: 1px solid #333; opacity: 1; margin: 0px 30px"></div>
        <div style="width: 30%">
          <div class="d-flex flex-column gap-3 align-items-center">
            <div v-if="imagePreview">
              <img :src="imagePreview" alt="Image Preview" width="100px" height="100px"
                style="border-radius: 100%; border: 1px solid black" />
            </div>
            <div v-else>
              <img :src="temp_profilePic ? require(`@/assets/${temp_profilePic}`) : require('@/assets/user.png')"
                alt="Image Preview" width="100px" height="100px" style="border-radius: 100%; border: 1px solid black" />
            </div>
            <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
            <button @click="triggerFileInput" :disabled="!isEditing">Select Image</button>
            <p v-if="file">Image Uploaded: {{ file.name }}</p>
            <!-- <input
                  type="file"
                  @change="previewImage"
                  accept="image/*"
                  style="display: none"
                /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "profile",
  components: {},
  computed: {},
  data: function () {
    return {
      isAdmin: false,
      show: false,
      email: "",
      old_password: "",
      emailErr: null,
      new_password: "",
      new_passwordConfirmation: "",
      passwordErr: null,
      newPasswordErr: null,
      passwordConfirmationErr: null,
      selectedGender: "",
      temp_selectedGender: "",
      options: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Prefer Not to Disclose", value: "Other" },
      ],
      file: null,
      imagePreview: null,
      isEditing: false,
      isChangePwd: false,
      temp_profilePic: "",
      show: false,
      showNew: false,
      showConfirm: false,
      errorMsg: '',
      oldPasswordMsg: '',
      newPasswordMsg: '',
      confirmPasswordMsg: ''
    };
  },
  props: {},
  methods: {
    showPassword() {
      this.show = !this.show;
    },
    showNewPassword() {
      this.showNew = !this.showNew;
    },
    showPasswordConfirmation() {
      this.showConfirm = !this.showConfirm;
    },
    async getUserDetails() {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser && storedUser.userID) {
        const userID = storedUser.userID;
        try {
          const res = await this.$axios.get(`/user/${userID}`);
          console.log('res', res)

          if (res.status === 200) {
            this.user = res.data.user
            console.log('this.user', this.user)
            const user = res.data.user;
            this.username = user.username;
            this.name = user.name;
            this.email = user.email;
            this.contactNumber = user.phoneNo;
            this.selectedGender = user.gender;
            this.temp_selectedGender = user.gender;
            this.temp_profilePic = user.profilePic;
          }
        } catch (err) {
          console.error('Error fetching user:', err)
        }
      } else {
        console.warn('User is not logged in or userID not found in localStorage');
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];

      if (this.file && this.file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };

        reader.readAsDataURL(this.file);
      } else {
        alert("Please select a valid image file.");
      }
    },
    async login() {
      !this.email ? (this.emailErr = false) : (this.emailErr = true);
      !this.password ? (this.passwordErr = false) : (this.passwordErr = true);
      if (this.email && this.password) {
        try {
          let dataToPost = {
            email: this.email,
            password: this.password,
          };
          const res = await this.$axios.post("login", dataToPost);
          if (res) {
            this.$showSuccess("success", res.data.message);
            this.$router.push("/home");
          }
        } catch (err) {
          this.$showSuccess("error", "Login Failed", err.response.data.error);
        }
      }
    },
    async saveChanges() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.$showSuccess("error", "Please enter a valid email address.");
        return;
      }
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userID = storedUser?.userID;
        console.log(userID)

        let formData = new FormData();
        formData.append('username', this.username);
        formData.append('name', this.name);
        formData.append('email', this.email);
        formData.append('phoneNo', this.contactNumber);
        formData.append('selectedGender', this.temp_selectedGender);
        formData.append('id', userID);
        formData.append('profilePic', this.file);

        const res = await this.$axios.post(`/user/update`, formData);
        if (res.status === 200) {
          this.$showSuccess("success", "Profile updated successfully");
          this.getUserDetails();
          this.isEditing = false;
        }
      } catch (err) {
        console.error(err);
        this.$showSuccess("error", "Failed to update profile");
      }
    },

    async updatePwd() {
      if (!this.validatePasswords()) {
        return;
      }
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userID = storedUser?.userID;
      console.log(userID)

      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userID = storedUser?.userID;

        const payload = {
          userId: userID,
          old_password: this.old_password,
          new_password: this.new_password,
          confirmPassword: this.new_passwordConfirmation

        };

        const res = await this.$axios.post('/user/update-pass', payload);

        if (res.status === 200) {
          this.$showSuccess("success", "Password updated successfully.");
          this.old_password = "";
          this.new_password = "";
          this.new_passwordConfirmation = "";
          this.isChangePwd = false;
        }
      } catch (err) {
        console.log(err)
        this.$showSuccess("error", err.response.data.error)
      }
    },

    validatePasswords() {
      let isValid = true;

      // Reset states
      this.passwordErr = null;
      this.newPasswordErr = null;
      this.passwordConfirmationErr = null;

      this.oldPasswordMsg = '';
      this.newPasswordMsg = '';
      this.confirmPasswordMsg = '';

      // Validate old password
      if (!this.old_password) {
        this.passwordErr = false;
        this.oldPasswordMsg = 'Old password does not match';
        isValid = false;
      } else {
        this.passwordErr = true;
      }

      // Validate new password
      if (!this.new_password) {
        this.newPasswordErr = false;
        this.newPasswordMsg = 'New password field is required';
        isValid = false;
      } else if (this.new_password.length < 8) {
        this.newPasswordErr = false;
        this.newPasswordMsg = 'New password must be at least 8 characters';
        isValid = false;
      } else {
        this.newPasswordErr = true;
      }

      // Validate confirmation
      if (!this.new_passwordConfirmation) {
        this.passwordConfirmationErr = false;
        this.confirmPasswordMsg = 'Password confirmation field is required';
        isValid = false;
      } else if (this.new_passwordConfirmation.length < 8) {
        this.passwordConfirmationErr = false;
        this.confirmPasswordMsg = 'Password Confirmation must be at least 8 characters';
        isValid = false;

      } else if (this.new_password !== this.new_passwordConfirmation) {
        this.passwordConfirmationErr = false;
        this.confirmPasswordMsg = 'Passwords do not match';
        isValid = false;
      }
      else {
        this.passwordConfirmationErr = true;
      }

      return isValid;
    }


  },
  mounted() {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const isAdmin = userDetails.is_admin;
    this.isAdmin = isAdmin === 0 ? false : true;
    this.getUserDetails()
  },
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

.user-account-info-container {
  background-color: #d9d9d980;
  padding: 10px;
}

.user-account-info-container .user-container-info-container-header {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

.user-account-info-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding: 30px;
}

.user-account-info-content-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-account-info-content-left-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 30px;
}

.active-tab {
  background-color: #f8f9fa;
  padding-left: 10px;
}

.caption {
  text-align: center;
  margin: 20px;
}
</style>

<template>
  <div class="" style="padding: 30px">
    <div class="d-flex flex-row">
      <h1>Profile</h1>
      <div
        class="d-flex flex-row gap-3 align-items-center justify-content-center w-100"
      >
        <p>Profile</p>
        <p>Orders</p>
        <p>Favourites</p>
      </div>
    </div>
    <div class="user-account-info-container">
      <div class="user-container-info-container-header">
        <h1>User Account Information</h1>
        <a href="/register" class="d-flex flex-row align-items-center">
          <p>Change Password</p>
          <img
            src="@/assets/Chevron Right.png"
            alt="Logo"
            width="20px"
            height="20px"
          />
        </a>
      </div>
      <hr style="border-top: 3px solid #333; opacity: 1; margin: 0px" />
      <div class="user-account-info-content">
        <div style="width: 70%">
          <div class="user-account-info-content-left">
            <div class="user-account-info-content-left-grid">
              <div>
                <label for="username">Username:</label>
                <b-form-input
                  id="username"
                  v-model="username"
                  placeholder="Enter your username"
                  trim
                ></b-form-input>
              </div>
              <div>
                <label for="username">Name:</label>
                <b-form-input
                  id="username"
                  v-model="username"
                  placeholder="Enter your username"
                  trim
                ></b-form-input>
              </div>
              <div>
                <label for="username">Email:</label>
                <b-form-input
                  id="username"
                  v-model="username"
                  placeholder="Enter your username"
                  trim
                ></b-form-input>
              </div>
              <div>
                <label for="username">Contact Number:</label>
                <b-form-input
                  id="username"
                  v-model="username"
                  placeholder="Enter your username"
                  trim
                ></b-form-input>
              </div>
            </div>
            <div class="d-flex flex-row gap-3">
              <label for="gender">Gender:</label>
              <b-form-radio-group
                class="d-flex flex-row w-100 justify-content-around"
                v-model="selectedGender"
                :options="options"
              ></b-form-radio-group>
            </div>
            <div>
              <b-button class="w-100" @click="login">Save Changes</b-button>
            </div>
          </div>
        </div>
        <div
          style="border-left: 1px solid #333; opacity: 1; margin: 0px 30px"
        ></div>
        <div style="width: 30%">
          <div class="d-flex flex-column gap-3 align-items-center">
            <div v-if="imagePreview">
              <img
                :src="imagePreview"
                alt="Image Preview"
                width="100px"
                height="100px"
                style="border-radius: 100%; border: 1px solid black"
              />
            </div>
            <div v-else>
              <img
                src="@/assets/user.png"
                alt="Image Preview"
                width="100px"
                height="100px"
                style="border-radius: 100%; border: 1px solid black"
              />
            </div>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              @change="handleFileUpload"
            />
            <button @click="triggerFileInput">Select Image</button>
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
      show: false,
      email: "",
      password: "",
      emailErr: null,
      passwordErr: null,
      selectedGender: "",
      options: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Not Specify", value: "Not Specify" },
      ],
      file: null,
      imagePreview: null,
    };
  },
  props: {},
  methods: {
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
</style>

<template>
  <div>
    <b-container v-if="payment_method === 'Credit / Debit Card'">
      <b-row>
        <b-col md="8" class="mx-auto">
          <h2 class="text-center mb-4 mt-4" style="color: gray">
            Payment Details
          </h2>
          <b-form
            @submit.prevent="handleSubmit"
            v-if="showForm"
            style="margin: 20px"
          >
            <b-form-group
              id="cardNumber"
              label="Card Number:"
              label-for="cardNumberInput"
              :state="cardNumberState"
            >
              <b-form-input
                id="cardNumberInput"
                v-model="cardNumber"
                :state="cardNumberState"
                @input="validateCardNumber"
                required
                placeholder="Enter card number"
              ></b-form-input>
              <b-form-invalid-feedback :state="cardNumberState">
                Please enter a valid card number.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-row>
              <b-col md="6">
                <b-form-group
                  id="expiryDate"
                  label="Expiration Date:"
                  label-for="expiryDateInput"
                  :state="expiryDateState"
                >
                  <b-form-input
                    id="expiryDateInput"
                    v-model="expiryDate"
                    :state="expiryDateState"
                    @input="validateExpiryDate"
                    required
                    placeholder="MM/YY"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="expiryDateState">
                    Please enter a valid expiration date.
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  id="cvv"
                  label="CVV:"
                  label-for="cvvInput"
                  :state="cvvState"
                >
                  <b-form-input
                    id="cvvInput"
                    v-model="cvv"
                    :state="cvvState"
                    @input="validateCVV"
                    required
                    placeholder="CVV"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="cvvState">
                    Please enter a valid CVV.
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-group
              id="billingAddress"
              label="Billing Address:"
              label-for="billingAddressInput"
              :state="billingAddressState"
            >
              <b-form-input
                id="billingAddressInput"
                v-model="billingAddress"
                :state="billingAddressState"
                required
                placeholder="Enter billing address"
              ></b-form-input>
              <b-form-invalid-feedback :state="billingAddressState">
                Please enter a billing address.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-button type="submit" variant="primary">Pay Now</b-button>
          </b-form>
          <b-alert
            :show="showSuccessMessage"
            variant="success"
            dismissible
            @dismissed="resetForm"
          >
            Payment successful! Thank you for your purchase.
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="payment_method === 'FPX'">
      <h2 class="text-center mb-4 mt-4" style="color: gray">FPX Payment</h2>
      <b-form @submit.prevent="submitPayment" style="margin: 20px">
        <b-form-group label="Bank" label-for="bankSelect">
          <b-form-select
            v-model="selectedBank"
            :options="banks"
            id="bankSelect"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Amount (MYR)" label-for="amountInput">
          <b-form-input
            :value="total"
            type="number"
            id="amountInput"
            readonly
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Name" label-for="nameInput">
          <b-form-input v-model="name" id="nameInput" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Pay Now</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
// import store from '@/store';

export default {
  name: "paymentPage",
  data() {
    return {
      showForm: true,
      showSuccessMessage: false,
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
      cardNumberState: null,
      expiryDateState: null,
      cvvState: null,
      billingAddressState: null,
      payment_method: "",

      selectedBank: null,
      total: "",
      name: null,
      banks: ["Bank A", "Bank B", "Bank C"],
    };
  },
  methods: {
    validateCardNumber() {
      const valid = /^[0-9]{16}$/.test(this.cardNumber);
      this.cardNumberState = valid ? true : false;
    },
    validateExpiryDate() {
      const valid = /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(this.expiryDate);
      this.expiryDateState = valid ? true : false;
    },
    validateCVV() {
      const valid = /^[0-9]{3}$/.test(this.cvv);
      this.cvvState = valid ? true : false;
    },
    handleSubmit() {
      // Perform form submission/validation here
      if (
        this.cardNumberState &&
        this.expiryDateState &&
        this.cvvState &&
        this.billingAddress
      ) {
        // Payment successful, show success message
        this.showForm = false;
        this.$showSuccess('success', 'Payment Successful', 'Order is created');
        this.$router.push({name: "home"});
      } else {
        // Invalid form, show error messages
        this.validateCardNumber();
        this.validateExpiryDate();
        this.validateCVV();
        this.billingAddressState = this.billingAddress ? true : false;
      }
    },
    submitPayment() {
        this.$showSuccess('success', 'Payment Successful', 'Order is created');
        this.$router.push({name: "home"});
    },
    resetForm() {
      // Reset form after success message dismissed
      this.showForm = true;
      this.showSuccessMessage = false;
      this.cardNumber = "";
      this.expiryDate = "";
      this.cvv = "";
      this.billingAddress = "";
      this.cardNumberState = null;
      this.expiryDateState = null;
      this.cvvState = null;
      this.billingAddressState = null;
    },
  },
  mounted() {
    // const cartProduct = JSON.parse(localStorage.getItem('cartProduct')) || [];
    this.payment_method = this.$route.params.payment_method;
    this.total = parseFloat(this.$route.params.total).toFixed(2);
    // this.payment_method = payment_method;
    // console.log("Order", this.payment_method);
  },
};
</script>

<template>
    <div class="content">
      <div class="chat-window card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Chat with Us</h5>
          <button @click="reloadView" class="btn btn-outline-primary p-1 m-0 d-flex align-items-center" style="border-radius: 20px; transition: all 0.3s;">
          <i class="bi bi-arrow-clockwise" style="font-size: 1.2rem; margin-right: 6px;"></i>
          <span style="font-size: 0.9rem; font-weight: 600;">New Conversation</span>
        </button>
        </div>
   
   
        <div class="card-body chat-body">
          <div v-for="message in messages" :key="message.id" class="message">
            <strong>{{ message.user }}:</strong>
            <span v-html="message.text"></span>
          </div>
   
          <!-- Quick reply options (shown only after first support message) -->
          <div v-if="messages.length === 1" class="quick-options mt-3">
            <p><strong>Select a topic to get started:</strong></p>
            <button class="btn btn-outline-primary btn-sm m-1" @click="selectOption('Product Recommendation')">🏸 Product Recommendation</button>
            <button class="btn btn-outline-primary btn-sm m-1" @click="selectOption('Product Searching')">🏸 Product Searching</button>
            <button class="btn btn-outline-primary btn-sm m-1" @click="selectOption('Shipping & Delivery Info')">📦 Shipping & Delivery Info</button>
            <button class="btn btn-outline-primary btn-sm m-1" @click="selectOption('Platform Guidance')">📱 Platform Guidance</button>
            <button class="btn btn-outline-primary btn-sm m-1" @click="selectOption('Return & Refund Policy')">🧾 Return & Refund Policy</button>
          </div>
   
          <!-- Dynamic options (e.g., sub-options for Platform Guidance) -->
          <div v-if="messages[messages.length - 1].options && messages[messages.length - 1].options.length > 0" class="mt-3">
            <p><strong>Choose an option:</strong></p>
            <button
              v-for="(opt, index) in messages[messages.length - 1].options"
              :key="index"
              class="btn btn-outline-secondary btn-sm m-1"
              @click="selectOption(opt.label)">
              {{ opt.label }}
            </button>
          </div>
        </div>
   
        <div class="card-footer chat-footer">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type a message"
            class="form-control"
            @keyup.enter="sendMessage"
            :disabled="disableInput"
          />
          <button
            class="btn btn-success"
            @click="sendMessage"
            :disabled="disableInput">
            Send
          </button>
        </div>
      </div>
    </div>
  </template>
   
  <script>
  import axios from 'axios';
   
  export default {
    name:"liveChatbot",
    data() {
      return {
        newMessage: '',
        messages: [
          { id: 1, user: 'Support', text: 'Hi! How can I assist you today?' }
        ],
        currentMainOption: null,
        awaitingKeyword: false,
        disableInput: true,
      };
    },
    methods: {
      reloadView() {
        location.reload();
      },
      sendMessage() {
        const input = this.newMessage.trim();
        if (!input) return;
   
        this.messages.push({
          id: this.messages.length + 1,
          user: 'You',
          text: input
        });
        this.newMessage = '';
   
        if (this.awaitingKeyword && this.currentMainOption === 'Product Searching') {
          this.disableInput = false;
          axios.post('/chatbot', {
            mainOption: 'Product Searching',
            subOption: input
          })
          .then(response => {
            this.messages.push({
              id: this.messages.length + 1,
              user: 'Support',
              text: response.data.reply
            });
          })
          .catch(error => {
            console.error(error);
            this.messages.push({
              id: this.messages.length + 1,
              user: 'Support',
              text: 'Sorry, something went wrong. Please try again.'
            });
          });
   
          this.awaitingKeyword = false;
          this.currentMainOption = null;
          this.disableInput = true;
          return;
        }
      },
   
      selectOption(selectedOption) {
        this.messages.push({
          id: this.messages.length + 1,
          user: 'You',
          text: selectedOption
        });
   
         if (selectedOption === 'Product Recommendation') {
          this.currentMainOption = 'Product Recommendation';
          this.messages.push({
            id: this.messages.length + 1,
            user: 'Support',
            text: 'Please select a category of product to recommend:',
            options: [
              { label: 'Accessories' },
              { label: 'Apparel' },
              { label: 'Bags' },
              { label: 'Footwear' },
              { label: 'Racquet' },
            ]
          });
          return;
        }
   
        if (selectedOption === 'Product Searching') {
          this.currentMainOption = 'Product Searching';
          this.awaitingKeyword = true;
          this.disableInput = false;  
          this.messages.push({
            id: this.messages.length + 1,
            user: 'Support',
            text: 'Please enter a keyword to search:',
          });
          return;
        }
   
        if (selectedOption === 'Platform Guidance') {
          this.currentMainOption = 'Platform Guidance';
          this.messages.push({
            id: this.messages.length + 1,
            user: 'Support',
            text: 'Please select a feature to get more info:',
            options: [
              { label: 'Profile Settings' },
              { label: 'Browse Equipment' },
              { label: 'View Cart' },
              { label: 'Checkout' },
              { label: 'Compare Equipment' },
              { label: 'Contact Us' },
              { label: 'About Us' }
            ]
          });
          return;
        }
   
        const isSubOption =
        this.currentMainOption === 'Product Recommendation' ||
        this.currentMainOption === 'Platform Guidance';
   
        axios.post('/chatbot', {
          mainOption: isSubOption ? this.currentMainOption : selectedOption,
          subOption: isSubOption ? selectedOption : null
        })
        .then(response => {
          this.messages.push({
            id: this.messages.length + 1,
            user: 'Support',
            text: response.data.reply,
            options: response.data.options || []
          });
   
          this.disableInput = true;
          if (isSubOption) {
            this.currentMainOption = null;
          }
        })
        .catch(error => {
          console.error(error);
          this.messages.push({
            id: this.messages.length + 1,
            user: 'Support',
            text: 'Sorry, something went wrong. Please try again.'
          });
        });
      }
    }
  };
  </script>
   
   
   
   
  <style scoped>
  .chat-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    font-size: 16px;
    display: block; 
    visibility: visible; 
    opacity: 1; 
  }
   
   
  .chat-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70vw;
    height: 70vh;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    z-index: 10;
  }
   
   
  .chat-header {
    background-color: #007bff;
    color: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px 10px 0 0;
  }
   
  .close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 18px;
  }
   
  .chat-body {
    padding: 10px;
    overflow-y: auto;
    flex: 1;
  }
   
   
  .message {
    margin-bottom: 10px;
  }
   
  .chat-footer {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
  }
   
  .chat-footer input {
    flex: 1;
    margin-right: 10px;
  }
  </style>
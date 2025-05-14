<template>
    <div class="contact-us">
      <h2>Contact Us</h2>
      <div class="contact-info">
        <div class="contact-details">
          <h3>Our Location</h3>
          <p>Hoops Academy, UTAR</p>
          <p>43000 KAJANG, SELANGOR</p>
          <p>MALAYSIA</p>
        </div>
        <div class="contact-details">
          <h3>Email</h3>
          <p>info@hoopsacademy.com</p>
        </div>
        <div class="contact-details">
          <h3>Phone</h3>
          <p>+60 123456789</p>
        </div>
      </div>
      <div class="contact-form">
        <h3>Send us a Message</h3>
        <form>
          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div class="form-group">
            <label for="email">Your Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ContactUs",
  };
  </script>
  
  <style scoped>
  .contact-us {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h2 {
    font-size: 32px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .contact-info {
    display: flex;
    justify-content: space-between;
  }
  
  .contact-details {
    flex: 1;
  }
  
  .contact-details h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .contact-details p {
    font-size: 18px;
  }
  
  .contact-form {
    margin-top: 40px;
  }
  
  form {
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  input,
  textarea {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 18px;
    color: #fff;
    background-color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #555;
  }
  </style>
  
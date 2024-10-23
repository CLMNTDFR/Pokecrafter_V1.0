// Function to handle errors during user sign-up by mapping error messages to user-friendly responses.
module.exports.signUpErrors = (err) => {
    let errors = { username: "", email: "", password_hash: "" };
  
    if (err.message.includes("username"))
      errors.username = "Incorrect or already taken username";
  
    if (err.message.includes("email")) errors.email = "Incorrect email";
  
    if (err.message.includes("password_hash"))
      errors.password_hash = "The password must be at least 6 characters long";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("username"))
      errors.username = "This username is already taken";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "This email is already taken";
  
    return errors;
  };

// Function to handle errors during user sign-in by mapping error messages to user-friendly responses.
  module.exports.signInErrors = (err) => {
    let errors = { email: '', password_hash: ''}
  
    if (err.message.includes("email")) 
      errors.email = "Email unknown";
    
    if (err.message.includes('password_hash'))
      errors.password_hash = "The password does not match"
  
    return errors;
  }

  module.exports.uploadErrors = (err) => {
    let errors = { format: "", maxSize: "" };
  
    if (err.message.includes("invalid file")) {
      errors.format = "Wrong format : Only jpg are accepted.";
    }
  
    if (err.message.includes("max size")) {
      errors.maxSize = "The max size is 500 Ko.";
    }
  
    return errors;
  };

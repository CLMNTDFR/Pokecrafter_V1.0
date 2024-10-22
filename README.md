# <p align="center">POKE-CRAFTER</p>
#### <p align="center">🧙‍♂️ Tanguy Moreau & Clément Defer 🤴🏼</p>
<hr><br>

[![Capture-d-cran-2024-10-22-090235.png](https://i.postimg.cc/RV0v2011/Capture-d-cran-2024-10-22-090235.png)](https://postimg.cc/Lhrd12bh)

## 📝 OVERVIEW
**POKE-CRAFTER** is a web application that combines the world of Pokémon with creativity and digital art. The project allows users to **create** and **share** works inspired by the Pokémon universe, with a strong emphasis on **community** and **social interaction**. Through an intuitive interface inspired by social media platforms, users can participate in **art contests** to win trophies, exchange **comments** and **likes** on other members' creations, and discover the most popular works on the platform through the **Trending** section. POKE-CRAFTER aims to connect digital artists who share the same passion, in a more focused way than platforms like **DeviantArt** or **ArtStation**.
<br><br>
This project features various functionalities, such as a **messaging system** to chat with other members, a dedicated space for managing **art contests**, the ability to **comment** and **react** to creations, as well as **customization** of user accounts. Users can explore works by category (AI, HandCraft, Digital Art, 3D, and Other), support their favorite artists, and actively participate in the community's life. POKE-CRAFTER stands out for its commitment to **creativity** and **interactivity**, providing a unique space where fans can express themselves and share their talents with a passionate community.


## 📚 RESOURCES

- **[React Documentation](https://legacy.reactjs.org)**: Official documentation for React, a JavaScript library for building user interfaces.
- **[Redux](https://redux.js.org/)**: Documentation for Redux, a predictable state container for JavaScript apps, often used with React.
- **[Node.js](https://nodejs.org/fr)**: Documentation for Node.js, a JavaScript runtime built on Chrome's V8 JavaScript engine.
- **[Express.js](https://expressjs.com/)**: Documentation for Express, a minimal and flexible Node.js web application framework.
- **[MongoDB](https://www.mongodb.com/)**: Guide and documentation for MongoDB, a NoSQL database for storing application data.
- **[Mongoose](https://mongoosejs.com/)**: Documentation for Mongoose, an elegant MongoDB object modeling tool for Node.js.
- **[Socket.IO](https://socket.io/)**: Real-time communication library documentation, ideal for chat functionalities.
- **[JSON Web Tokens (JWT)](https://jwt.io/introduction/)**: Introduction to JSON Web Tokens, a method for securely transmitting information between parties.
- **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs)**: Library for hashing passwords and ensuring security for user authentication.
- **[React Router](https://reactrouter.com/)**: Official documentation for React Router, a routing library for navigating between different views in React.
- **[React Redux](https://react-redux.js.org/)**: Documentation for React bindings for Redux, making it easier to work with React and Redux together.
- **[Sass](https://sass-lang.com/)**: Documentation for Sass, a CSS preprocessor for writing cleaner, more maintainable stylesheets.


## 🎥 VIDEO PREVIEW




## 🛠️ TECHNOLOGIES and TOOLS USED

POKE-CRAFTER is based on the **MERN stack** along with additional tools ensuring **security** and a **smooth user experience**. Below are the main technologies used in this project:

---

### 🎨 **Frontend:**

- `React.js` 
- `Redux`
- `Axios`
- `Sass`
- `Socket.io-client`

---

### 🏗️ **Backend:**

- `Node.js`
- `Express.js`
- `JWT`
- `Bcrypt`
- `Cookie-Parser`
- `Express-FileUpload`
- `Mongoose`
- `Socket.io`

---

### 🗄️ **Database:**

- `MongoDB`

---

### 🚀 **Infrastructure and Deployment:**

- `Docker`
- `Docker-Compose`

## 📈 Architectural Diagram

Here is an overview of the overall architecture of the **POKE-CRAFTER** application:

#### Data Flow

This diagram illustrates the flow of data in the application, from user interactions to the display of information on the screen.

[![Poke-Crafter-Diagram-drawio.png](https://i.postimg.cc/Kvm4pQVV/Poke-Crafter-Diagram-drawio.png)](https://postimg.cc/qgZkzcpX)

#### Description:

- **User:** Interacts with the front-end interface.
- **Front-end:** Sends requests to the back-end when an action is performed (for example, add an artwork).
- **Back-end:** Processes requests according to the MVC model, accesses database data.
- **Database:** Stores information about users, artworks, contests, etc.

## 👤 User-Story Map

The user story map describes the main activities that a user can do. These activities are divided into steps then into more detailed sub-activities.

[![user-story-maps-drawio.png](https://i.postimg.cc/13G8v2RL/user-story-maps-drawio.png)](https://postimg.cc/NK0GMNH4)

## 🏛️ Architecture

Below is the architecture diagram that outlines the Minimum Viable Product (MVP) for the PokeCrafter platform. This diagram visualizes the interactions between different components, from user requests to data storage and processing.

[![Data-Mod-drawio.png](https://i.postimg.cc/SQG2Lws3/Data-Mod-drawio.png)](https://postimg.cc/HjVkdvb9)

## 🚀 Installation and Configuration

Follow these steps to install and configure **POKE-CRAFTER** on your local machine:

### Prerequisites

- Node.js (version 22) and npm installed on your machine.



### Installation

#### 1. Clone the deposit:

  ```bash
  git clone https://github.com/CLMNTDFR/Pokecrafter_V1.0.git
  ```

#### 2. Install the frontend and backend dependencies:


  For the backend:

  ```bash
  npm install
  ```

  For the frontend:

  ```bash
  cd /client
  ```

  ```bash
  npm install
  ```
    


#### 3. Database configuration:

- Create an account on MongoDB Atlas
- Follow Mongo DB [Mongo DB](https://www.mongodb.com/resources/products/fundamentals/mongodb-cluster-setup) instructions
- Generate a token randomly with [this tool](https://it-tools.tech/token-generator)
- Create an `.env` file in `/config` and `/client` taking the example of `.env(exemple)`

#### 4. Start the development server:

##### Open two terminals:

- At the root, for the backend:

```bash
npm start
```

- For the frontend:

```bash
cd /client
npm start
```

#### 5. Access the application:

Open your browser and navigate to `http://localhost:3000` to access the frontend.

## 💡 Use

- Create an account or log in
  - Open the application and create a new account using your email.

- Access to your profil page
  - Click on your username at the top right.
  - Change your profile picture and bio.
  - Check the number of trophies you have and the artwork you have posted.

- Add an artwork
  - Click on the `+` button in the navigation bar.
  - Upload an image and add a description.

- Discover other works
  - Navigate to `home` or to `trending` to see artworks sorted by categories or popularity respectively.

- Create a contest
  - Navigate to the `contest` page and unfold the creation form.

- Take part in a contest
  - Discover the contests created by common users (classic contest) or by admins (official contests) and try to win trophies.

- Interact with other members
  - Click on the "magnifying glass" icon to search for an artist and add them to your contacts.
  - Click on the messaging icon at the top left and start a conversation with your friend.

## ✨ Main Features

- **Artwork Creation & Sharing:** Users can create, upload, and share their Pokémon-inspired artwork across various categories such as AI Art, Handcraft, Digital Art, 3D, and more.
- **Art Contests:** Engage in themed art competitions, showcase your skills, and compete for trophies and recognition.
- **Trending Section:** Discover popular and trending artworks, curated based on user interactions and likes.
- **Community Interaction:** Like, comment, and engage with other users' creations. Build connections and grow as part of a creative community.
- **Messaging System:** Connect with fellow artists through private messaging to exchange ideas, tips, or just chat.
- **Profile Customization:** Personalize your user profile to showcase your work and achievements.
- **Secure User Authentication:** Sign up, log in, and manage your account securely with encrypted authentication.

## 🔮 Future Features

- **Google Sign-In:** Enable quick and easy login through Google accounts for a seamless user experience.
- **Email Notifications & Identity Verification:** Implement a system for email alerts, including notifications for new messages, artwork updates, and account activities, along with secure identity verification.
- **Detailed Artist Profile Pages:** Expand user profiles to showcase detailed artist information, including a gallery of works, personal bio, and achievements.
- **Mobile Application:** Develop a dedicated mobile app to bring all POKE-CRAFTER features to users on the go, enhancing accessibility and engagement.


## 🤝 Contribute

Contributions are welcome! Here's how to proceed:

1. **Fork the repository:** Create a copy of the project on your GitHub account.
2. Clone the forked deposit on your local machine.
3. Create a branch for your feature or bug fix.
4. Make the necessary changes and make sure they meet project standards.
5. Open a Pull Request to submit your contribution.

Thank you for your help and your ideas! 🚀

## 📬 Contact

### Clément DEFER
- [LinkedIn](https://www.linkedin.com/in/clmntdfr/)
- [Portfolio Website](https://clementdefer.netlify.app/)
- **Mail:** deferclement59@gmail.com


### Tanguy Moreau
- **Mail:** tanguymoreau.aes@gmail.com

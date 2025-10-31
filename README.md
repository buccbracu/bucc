# 🚀 BUCC Web App (Next.js)

This project is developed and maintained by the **BRAC University Computer Club (BUCC)** Web Team.  
Follow the instructions below to set up the project locally and contribute effectively.

---

## 🧩 Setup Instructions

### 1. Install Required Tools

- **Node.js** (v18 or above recommended)  
  🔗 [Download Node.js](https://nodejs.org/en/download)

- **Visual Studio Code (VS Code)** *(Recommended Editor)*  
  🔗 [Download VS Code](https://code.visualstudio.com/)

- **Git**  
  🔗 [Download Git](https://git-scm.com/downloads)

### 2. Configure Git

Run the following commands in your terminal (replace with your own info):
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
````

### 3. Fork and Clone the Repository

1. Fork this repository to your own GitHub account.
2. Clone your forked repository:

   ```bash
   git clone <your-forked-repo-url>
   ```
3. Move into the project directory:

   ```bash
   cd bucc
   ```

### 4. Install Dependencies

Run the following command to install project dependencies:

```bash
npm i
```

### 5. Configure Environment Variables

1. Rename the `.env.example` file to `.env`
2. Either:

   * Fill in your own environment variables (e.g., database URI, auth secrets, etc.)
   * **Or** contact the **BUCC R&D Department** for the development `.env` file

---

## 💻 Running the Project

To start the development server:

```bash
npm run dev
```

To build for production and test:

```bash
npm run build
```

---

## 🤝 Contributing Guidelines

> **Note:** Always create a new branch for each feature or fix.

### 1. Create a Branch

Use the following format for your branch names:

```bash
git checkout -b prefix/branch-name
```

**Examples:**

* `feat/add-navbar`
* `fix/navbar-overlap`
* `docs/update-readme`

---

### 2. Make Changes

* Implement your feature or fix.
* Test locally with:

  ```bash
  npm run build
  ```

---

### 3. Commit Changes

Follow **European-style commit messages** (lowercase, short, and descriptive).
Example:

```
add user authentication module
fix navbar alignment issue
update readme with setup guide
```

Push your branch to your fork:

```bash
git push origin prefix/branch-name
```

---

### 4. Open a Pull Request (PR)

* Go to your forked repo on GitHub and click **"New Pull Request"**.
* Provide a brief but clear description of what you changed.
* Wait for review by the **BUCC Web Team**.

Once approved, your branch will be merged into the main repository. 🎉

---

## 🧠 Need Help?

If you face any issues, reach out to the **BUCC Web Team** or tag the relevant members in your pull request.



**Maintained by:**
💻 **BUCC Web Team**
🌐 [BRAC University Computer Club](https://www.bracucc.org)






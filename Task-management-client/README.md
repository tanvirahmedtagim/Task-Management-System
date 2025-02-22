### TIME&TIDE - README

# TIME&TIDE

## 🔹 Short Description

TIME&TIDE is a full-featured task management application where users can add, edit, delete, and reorder tasks using a drag-and-drop interface. The frontend is built with React.js, Tailwind CSS, and DaisyUI for a clean and modern UI experience. The app ensures real-time updates and seamless user interactions.

## 🔹 Live Links

- **Live App:** [TIME&TIDE Live](https://timetide.netlify.app/)

## 🔹 Technologies Used

- **Frontend:** React.js, Tailwind CSS, DaisyUI
- **State Management:** React Query
- **Drag & Drop:** React Beautiful DnD, Hello Pangea DnD
- **Authentication:** Firebase
- **Routing:** React Router
- **Animations & UI Enhancements:** Lottie React, React Awesome Reveal, React Icons
- **Date Handling:** Date FNS
- **API Requests:** Axios

## 🔹 Dependencies

- @hello-pangea/dnd
- @tanstack/react-query
- @tanstack/react-router
- axios
- date-fns
- firebase
- jodit-react
- lottie-react
- react
- react-beautiful-dnd
- react-datepicker
- react-dom
- react-helmet
- react-icons
- react-loader-spinner
- react-router-dom
- react-sweetalert2
- react-tooltip

## 🔹 Installation Steps

Follow these steps to set up and run the frontend project:

1️⃣ **Clone the repository**

```bash
git clone https://github.com/tanvirahmedtagim/Task-Management-System.git
cd Task-Management-System
cd Task-management-client
```

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Set up environment variables**  
Create a `.env` file in the root directory and add:

```
VITE_API_BASE_URL=https://task-management-system-psi-beryl.vercel.app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_APP_ID=your_firebase_app_id
```

4️⃣ **Run the application**

```bash
npm run dev
```

5️⃣ **Frontend will run on**

```
http://localhost:5173
```

This frontend seamlessly integrates with the backend API to provide a smooth and real-time task management experience.

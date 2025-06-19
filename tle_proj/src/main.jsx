import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import StudentProfile from './components/StudentProfile.jsx'
import React from "react"
import UserContestDetails from './components/UserContestDetails.jsx'
import UserContextProvider from './context/UserContextProvider'
import CronScheduler from './components/CronScheduler.jsx'
import EmailReminderSettings from './components/EmailReminderSettings.jsx'
import ThemeToggle from './components/Themetoggle.jsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
  },
  {
    path: '/student/:user',
    element: (<div className="min-h-screen bg-gray-50">
      <StudentProfile  />
    </div>)
  },
  {
    path: '/contest',
    element: <UserContestDetails handle="er.abhijeet"/>,
  },{
    path: '/cron',
    element: <CronScheduler />,
  },
  {
    path: '/email/:handle',
    element: <EmailReminderSettings />,
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </UserContextProvider>
)

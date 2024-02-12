import React, { useState } from 'react'
import { FaGoogle, FaApple, FaMicrosoft, FaYahoo, FaArrowLeft, FaGithub } from 'react-icons/fa'
import { IoMdCalendar } from 'react-icons/io'
import { RiCalendarEventFill } from 'react-icons/ri'
import { IconContext } from 'react-icons'
import { nanoid } from 'nanoid'
import axios from 'axios'

const Card = ({ title, startTime, endTime, location, description }) => (
  <div className="bg-white rounded-md p-4 w-80">
    <div className="flex items-center mb-2">
      <IoMdCalendar className="text-black mr-2" />
      <p className="text-base font-medium text-black uppercase">{title}</p>
    </div>
    <p className="text-sm font-medium text-gray-500">{new Date(startTime).toLocaleString()}</p>
    <p className="text-sm font-medium text-gray-500">{location}</p>
    <p className="text-sm font-medium text-gray-500">{description}</p>
  </div>
)

const Button = ({ onClick, children }) => (
  <button
    className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 mt-4 mb-5 square"
    onClick={onClick}
  >
    {children}
  </button>
)

const TextArea = ({ value, onChange }) => (
  <textarea
    className="border border-gray-300 p-2 w-80 h-40 resize-none square"
    value={value}
    onChange={onChange}
  />
)

const Input = ({ value }) => (
  <input className="border border-gray-700 rounded-md p-2 w-80 square bg-gray-900 text-gray-200" type="text" value={value} readOnly />
)

const BackButton = ({ onClick, text }) => (
  <button
    className="focus:outline-none focus:ring-2 focus:ring-white-600 focus:ring-opacity-50 mt-4 mb-8 square flex items-center"
    onClick={onClick}
  >
    <FaArrowLeft className="text-gray-200 mr-2" />
    <span className="text-gray-200">{text}</span>
  </button>
)

const HomeButton = ({ onClick }) => (
  <button
    className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 mt-4 mb-5 square"
    onClick={onClick}
  >
    <FaArrowLeft className="text-blue-500" />
  </button>
)

const Header = () => (
  <div className="flex justify-center items-center w-full h-20">
    <h1 className="text-4xl font-bold text-white uppercase">
      📆 Linky Link
    </h1>
  </div>
)

const Footer = () => (
  <div className="mb-2">
    <a href="https://gitwit.dev" target="_blank" rel="noopener noreferrer" className="text-white flex items-center text-sm justify-center opacity-75 hover:opacity-100">
      <img src="https://framerusercontent.com/images/SmLDF79Mns070VHglJVQyuQ1A.png" alt="Gitwit" className="h-8 mr-2" /> MADE WITH GITWIT
    </a>
  </div>
)

export default function App() {
  const [eventDesc, setEventDesc] = useState('')
  const [eventInfo, setEventInfo] = useState({})
  const [shortUrl, setShortUrl] = useState('')
  const [showLinks, setShowLinks] = useState(false)
  const [showForm, setShowForm] = useState(true)

  const generateLinks = async () => {
    const response = await axios.get(`https://calendar-link-server.onrender.com/api/generate-link?prompt=${encodeURIComponent(eventDesc.trim())}`)
    const { title, startTime, endTime, location, description, guests, recurrence, google_calendar_link, apple_calendar_link, outlook_calendar_link, yahoo_calendar_link } = response.data
    setEventInfo({ title, startTime, endTime, location, description, guests, recurrence, google_calendar_link, apple_calendar_link, outlook_calendar_link, yahoo_calendar_link })
    setShowLinks(true)
    setShowForm(false)
    const encodedData = encodeURIComponent(JSON.stringify(response.data))
    setShortUrl(`https://linkylink.lol/?data=${encodedData}`)
  }

  const resetForm = () => {
    setEventDesc('')
    setEventInfo({})
    setShortUrl('')
    setShowLinks(false)
    setShowForm(true)
  }

  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-4">
      <Header />
      {showLinks && (
        <div className="flex flex-col items-center mt-2">
          <BackButton onClick={resetForm} text="BACK" />
        </div>
      )}
      {showForm && (
        <div className="flex flex-col items-center mb-4 square">
          <h1 className="font-semibold text-lg mb-5 text-gray-300 uppercase rainbow-text">
            ENTER EVENT DESCRIPTION
          </h1>
          <TextArea value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
        </div>
      )}
      {showForm && (
        <Button onClick={generateLinks}>
          GENERATE LINKS
        </Button>
      )}
      {showLinks && (
        <div className="flex flex-col items-center mt-4">
          <h2 className="font-semibold text-md mt-2 mb-4 text-gray-200 uppercase">
            <IconContext.Provider value={{ color: 'gray', size: '1.5rem', className: 'mr-2' }}>
              <div className="flex items-center">
                <p>EVENT INFO</p>
              </div>
            </IconContext.Provider>
          </h2>
          <Card {...eventInfo} />
          <h2 className="font-semibold text-md mt-10 mb-4 text-gray-200 uppercase">
            ADD TO CALENDAR
          </h2>
          <IconContext.Provider value={{ color: 'white', size: '2rem' }}>
            <div className="flex items-center mb-2">
              <a href={eventInfo.google_calendar_link} target="_blank" rel="noopener noreferrer" className="mr-3">
                <FaGoogle />
              </a>
              <a href={eventInfo.apple_calendar_link} target="_blank" rel="noopener noreferrer" className="mr-3">
                <FaApple />
              </a>
              <a href={eventInfo.outlook_calendar_link} target="_blank" rel="noopener noreferrer" className="mr-3">
                <FaMicrosoft />
              </a>
              <a href={eventInfo.yahoo_calendar_link} target="_blank" rel="noopener noreferrer">
                <RiCalendarEventFill />
              </a>
            </div>
          </IconContext.Provider>
          {shortUrl && (
            <div className="flex flex-col items-center mt-4">
              <h2 className="font-semibold text-md mt-6 mb-4 text-gray-200 uppercase">
                PERMALINK
              </h2>
              <Input value={shortUrl} />
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  )
}


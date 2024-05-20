import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from './Hero/Hero'

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      {/* <NavBar /> */}
      <Hero />
    </React.Fragment>
  )
}

export default Dashboard

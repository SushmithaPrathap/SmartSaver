import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { message } from 'antd'

const NavBar = () => {
  const [loginUser, setLoginUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  )
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setLoginUser(user)
    }
  }, [])

  const logoutHandler = () => {
    localStorage.removeItem('user')
    setShow(false)
    navigate('/signin')
  }
  return (
    <>
      <nav>
        <h1 onClick={() => navigate('/')}>EconoMeister</h1>
        {loginUser !== null ? (
          <div className="name-div">
            <p className="name-p"> Hi, {loginUser?.name}!</p>
            <p onClick={() => setShow(!show)} className="name-letter">
              {loginUser?.name.charAt(0)}
            </p>
          </div>
        ) : (
          <div className="name-div">
            <button
              onClick={() => navigate('/signin')}
              className="main-btn-signin"
              style={{ margin: '0px 5px' }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="main-btn"
              style={{ margin: '0px 5px' }}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className={show ? 'menu-div' : 'menu-hide'}>
          <p onClick={() => logoutHandler()} className="logout">
            Logout
          </p>
        </div>
      </nav>
    </>
  )
}

export default NavBar

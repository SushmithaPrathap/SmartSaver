import React from 'react'
import './signup.css'
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()

  const [email, setEmail] = useState('')
  const [emailFocus, setEmailFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  // const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [email, pwd, matchPwd])

  const handleSubmit = async (e) => {
    console.log('in handle')
    e.preventDefault()
    const body = { email: email, password: pwd }
    console.log(JSON.stringify(body))
    try {
      const response = await axios.post(
        'http://localhost:8080/api/users/signin',
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      console.log(response.data)
      // setSuccess(true)
      localStorage.setItem('user', JSON.stringify(response?.data))
      setEmail('')
      setPwd('')
      setMatchPwd('')
      navigate('/')
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus()
    }
  }

  return (
    <section className="user-section">
      <div className="register-section">
        {/* <p
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live="assertive"
      >
        {errMsg}
      </p> */}
        <h1>Sign In</h1>
        <form>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            ref={userRef}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
        </form>
        <p className="signIn">
          New here, Please Register!
          <span className="line">
            <Link to={`/signup`} className="line-a">
              Sign Up
            </Link>
          </span>
        </p>

        <button onClick={(e) => handleSubmit(e)} className="main-btn">
          Sign In!
        </button>
      </div>
    </section>
  )
}

export default Login

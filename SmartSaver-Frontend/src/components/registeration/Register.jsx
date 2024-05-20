import React from 'react'
import './signup.css'
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const nameRef = useRef()
  const emailRef = useRef()
  const incomeRef = useRef()
  const errRef = useRef()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  //   const [validName, setValidName] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [name, setName] = useState('')
  //   const [validName, setValidName] = useState(false)
  const [nameFocus, setNameFocus] = useState(false)

  const [income, setIncome] = useState('')
  const [incomeFocus, setIncomeFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  // const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    console.log('in handle')
    e.preventDefault()
    const body = {
      email: email,
      password: pwd,
      monthlyIncome: income,
      name: name,
    }
    console.log(JSON.stringify(body))
    try {
      const response = await axios.post(
        'http://localhost:8080/api/users/signup',
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      console.log(response.data)
      setSuccess(true)
      localStorage.setItem('user', JSON.stringify(response?.data))
      setEmail('')
      setPwd('')
      setIncome('')
      setName('')
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

  useEffect(() => {
    nameRef.current.focus()
  }, [])

  // useEffect(() => {
  //   setValidMatch(pwd === matchPwd)
  // }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('')
  }, [email, name, pwd, matchPwd])

  return (
    <section className="user-section">
      <div className="register-section">
        <p
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offscreen'}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Sign Up</h1>
        <form>
          <label htmlFor="email">Name:</label>
          <input
            type="text"
            id="name"
            ref={nameRef}
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          <label htmlFor="email">Monthly Income:</label>
          <input
            type="text"
            id="income"
            ref={incomeRef}
            onChange={(e) => setIncome(e.target.value)}
            value={income}
            required
            onFocus={() => setIncomeFocus(true)}
            onBlur={() => setIncomeFocus(false)}
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
          <label htmlFor="confirm_pwd">
            Confirm Password:
            {/* <FontAwesomeIcon
            icon={faCheck}
            className={validMatch && matchPwd ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validMatch || !matchPwd ? 'hide' : 'invalid'}
          /> */}
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            //   aria-invalid={validMatch ? 'false' : 'true'}
            //   aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          {/* <p
          id="confirmnote"
          className={matchFocus ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password input field.
        </p> */}
        </form>
        <p className="signIn">
          Already registered?
          <span className="line">
            <Link to={`/signin`} className="line-a">
              Sign In
            </Link>
          </span>
        </p>

        <button onClick={(e) => handleSubmit(e)} className="main-btn">
          Sign Up!
        </button>
      </div>
    </section>
  )
}

export default Register

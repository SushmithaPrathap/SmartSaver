import React from 'react'
import { useRef, useState, useEffect } from 'react'
import './expense.css'
import axios from 'axios'

const ExpenseForm = ({ handleFunc, action, item }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [catInd, setCatInd] = useState('')
  const [subCat, setSubCat] = useState('')
  const [type, setType] = useState('')
  const [des, setDes] = useState('')
  const [catList, setCatList] = useState(null)

  const handleSubmit = async (e) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const cat = subCat === '' ? category.categoryId : subCat
    e.preventDefault()
    const body = {
      name,
      categoryId: cat,
      amount,
      date,
      type,
      description: des,
      userId: user.userId,
    }

    // console.log(JSON.stringify(body))
    try {
      const response = await axios.post(
        'http://localhost:8080/api/transactions',
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      // console.log(response?.data)
      handleFunc()

      setName('')
      setAmount('')
      setCategory('')
      setDate('')
      setDes('')
      setType('')
      setSubCat('')
      setCatInd('')
    } catch (err) {
      console.log('error in add', err)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const response = await axios.get(
        `http://localhost:8080/api/category/user/${user.userId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )

      // console.log('cat', response?.data)

      setCatList(response?.data)
    } catch (err) {
      console.log('error in get', err)
    }
  }

  return (
    <div className="form-div">
      <h3 style={{ color: '#fff' }}>Add a new Transaction</h3>
      <div>
        <form>
          <label htmlFor="email">Transaction Name:</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
          <label htmlFor="email">Amount:</label>
          <input
            type="text"
            id="amount"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            required
          />

          <label htmlFor="email">Date:</label>
          <input
            type="date"
            id="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
          />

          <label htmlFor="password">Category:</label>
          <select
            onChange={(e) => {
              const val = e.target.value
              const catVar = catList[val]
              setCategory(catVar)
              setCatInd(val)
            }}
            name="catInd"
            id="select-cat"
            value={catInd}
          >
            <option value="">--Please choose a Category--</option>
            {catList !== null && (
              <>
                {catList.map((item, index) => (
                  <option value={index}>{item.categoryName}</option>
                ))}
              </>
            )}
          </select>
          {category !== '' && category.subCategories.length !== 0 && (
            <>
              <label htmlFor="password">Sub Category:</label>
              <select
                onChange={(e) => {
                  setSubCat(e.target.value)
                }}
                name="category"
                id="select-cat"
                value={subCat}
              >
                <option value="">--Please choose a sub category--</option>

                {category.subCategories.map((item) => (
                  <option value={item.categoryId}>{item.categoryName}</option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="confirm_pwd">Type:</label>
          <select
            onChange={(e) => setType(e.target.value)}
            name="type"
            id="select-type"
            value={type}
          >
            <option value="">--Please choose a Type--</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <label htmlFor="confirm_pwd">Description:</label>
          <textarea value={des} onChange={(e) => setDes(e.target.value)} />

          <button onClick={(e) => handleSubmit(e)} className="main-btn">
            Add New
          </button>
        </form>
      </div>
    </div>
  )
}

export default ExpenseForm

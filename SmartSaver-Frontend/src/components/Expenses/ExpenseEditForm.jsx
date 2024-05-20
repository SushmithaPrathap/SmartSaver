import React from 'react'
import { useRef, useState, useEffect } from 'react'
import './expense.css'
import axios from 'axios'

const ExpenseEditForm = ({ handleFunc, item, close }) => {
  const [name, setName] = useState(item.transaction.name)
  const [amount, setAmount] = useState(item.transaction.amount)
  const [date, setDate] = useState(item.transaction.date)
  const [category, setCategory] = useState(item.category)
  const [type, setType] = useState(item.transaction.type)
  const [des, setDes] = useState(item.transaction.description)
  const [catInd, setCatInd] = useState(item.category.categoryId)
  const [subCat, setSubCat] = useState(
    item.category.subCat !== undefined ? item.category.subCat.categoryId : ''
  )
  const [catList, setCatList] = useState(null)
  const [finalValue, setFinalValue] = useState(
    item.category.subCat !== undefined
      ? item.category.subCat.categoryId
      : item.category.categoryId
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user'))
    const body = {
      name,
      categoryId: parseInt(finalValue),
      amount,
      date,
      type,
      description: des,
      userId: user.userId,
    }

    console.log(body)
    try {
      const response = await axios.put(
        `http://localhost:8080/api/transactions/${item.transaction.transactionId}`,
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      handleFunc()
      close()
      setName('')
      setAmount('')
      setCategory('')
      setDate('')
      setDes('')
      setType('')
      setSubCat('')
      setCatInd('')
    } catch (err) {
      console.log('error in edit', err)
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

      setCatList(response?.data)
    } catch (err) {
      console.log('error in get', err)
    }
  }
  return (
    <div className="form-div">
      <div className="edit-btn-div" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ color: '#fff' }}>Edit the Transaction</h3>
        <button onClick={() => close()} className="main-btn-signin">
          X
        </button>
      </div>
      <div>
        <form>
          <label htmlFor="name">Transaction Name:</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            required
          />

          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
          />

          <label htmlFor="Category">Category:</label>
          <select
            onChange={(e) => {
              const val = e.target.value
              const catVar = catList.find((i) => i.categoryId == val)
              setCategory(catVar)
              setCatInd(val)
              setFinalValue(val)
            }}
            name="catInd"
            id="select-cat"
            value={catInd}
          >
            <option value="">--Please choose a Category--</option>
            {catList !== null && (
              <>
                {catList.map((item, index) => (
                  <option value={item.categoryId}>{item.categoryName}</option>
                ))}
              </>
            )}
          </select>

          {(subCat !== '' || category.subCategories.length !== 0) && (
            <>
              <label htmlFor="password">Sub Category:</label>
              <select
                onChange={(e) => {
                  setSubCat(e.target.value)
                  setFinalValue(e.target.value)
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
          <div className="edit-btn-div">
            <button onClick={(e) => handleSubmit(e)} className="main-btn">
              Edit Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseEditForm

import React from 'react'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import './hero.css'
import { RiDeleteBin5Fill } from 'react-icons/ri'

const AddTransactions = ({ handleFunc }) => {
  const [subList, setSubList] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [catInd, setCatInd] = useState('')
  const [subCat, setSubCat] = useState('')
  // const [type, setType] = useState('')
  // const [des, setDes] = useState('')
  const [catList, setCatList] = useState(null)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user'))
    const cat = subCat === '' ? category.categoryId : subCat

    const date = new Date()
    const year = date.toLocaleString('default', { year: 'numeric' })
    const month = date.toLocaleString('default', { month: '2-digit' })
    const day = date.toLocaleString('default', { day: '2-digit' })

    const formattedDate = year + '-' + month + '-' + day

    const body = subList.map((item) => {
      return {
        name: item.name,
        categoryId: cat,
        amount: item.amount,
        date: formattedDate,
        type: 'Expense',
        description: '',
        userId: user.userId,
      }
    })

    console.log(body)
    try {
      const response = await axios.post(
        'http://localhost:8080/api/transactions/addToBag',
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      handleFunc()

      setName('')
      setAmount('')
      setCategory('')
      setSubCat('')
      setCatInd('')
      setSubList([])
    } catch (err) {
      console.log('error in add', err)
    }
  }

  const addItemFunc = (e) => {
    e.preventDefault()
    const item = {
      name,
      amount,
    }
    const newList = [...subList, item]
    setSubList(newList)
    setName('')
    setAmount('')
  }

  const removeItem = (e, index) => {
    e.preventDefault()
    const newList = [...subList.slice(0, index), ...subList.slice(index + 1)]

    setSubList(newList)
    setName('')
    setAmount('')
  }

  return (
    <>
      <section>
        <h3 style={{ color: '#fff', textAlign: 'center' }}>
          Quick Add Transaction
        </h3>

        <div className="tran-show-div">
          {subList.length !== 0 ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              {subList.map((item, index) => (
                <div className="tran-show-div1">
                  <p>Name: {item.name}</p>
                  <p>Budget: {item.amount}</p>
                  <RiDeleteBin5Fill
                    className="icon"
                    onClick={(e) => removeItem(e, index)}
                  />
                </div>
              ))}

              <button onClick={(e) => handleSubmit(e)} className="main-btn">
                Add All At Once
              </button>
            </div>
          ) : (
            <div className="tran-show-div1">
              Add Multiple Expense at Once, Select Category
            </div>
          )}
        </div>

        <form>
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

          <button onClick={(e) => addItemFunc(e)} className="small-btn">
            Add
          </button>
        </form>
      </section>
    </>
  )
}

export default AddTransactions

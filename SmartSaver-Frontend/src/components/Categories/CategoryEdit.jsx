import React from 'react'
import { useState } from 'react'
import './category.css'
import axios from 'axios'
import AddForm from './AddForm'
import { RiDeleteBin5Fill } from 'react-icons/ri'

const CategoryEditForm = ({ handleFunc, close, item }) => {
  const [name, setName] = useState(item.categoryName)
  const [pId, setPId] = useState(item.parentCategoryId)
  const [budget, setBudget] = useState(item.budget)
  const [addSub, setAddSub] = useState(false)
  const [subList, setSubList] = useState([])

  console.log('item', item)

  const handleSubmit = async (e) => {
    console.log('in handle')
    const user = JSON.parse(localStorage.getItem('user'))
    e.preventDefault()
    const body = {
      ...item,
      categoryName: name,
      budget,
      userId: user.userId,
    }

    console.log(JSON.stringify(body))
    try {
      const response = await axios.put(
        `http://localhost:8080/api/category/${item.categoryId}`,
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      console.log(response?.data)
      handleFunc()

      setName('')
      setBudget('')
      setSubList([])
      close()
    } catch (err) {
      console.log('error in add', err)
    }
  }

  const addSubCat = async (e, sub) => {
    console.log('in add sub', sub)
    const user = JSON.parse(localStorage.getItem('user'))
    e.preventDefault()
    const body = {
      categoryName: sub.categoryName,
      budget: sub.budget,
      userId: user.userId,
      parentCategoryId: item.categoryId,
      categoryId: 13,
    }

    console.log(JSON.stringify(body))
    try {
      const response = await axios.post(
        'http://localhost:8080/api/category',
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      console.log(response?.data)
      handleFunc()
      close()

      //   setName('')
      //   setBudget('')
      //   setSubList([])
    } catch (err) {
      console.log('error in add', err)
    }
  }

  const addItemFunc = (item) => {
    const newList = [...subList, item]
    setSubList(newList)
    console.log('in add func', item, newList)
  }

  const removeItem = (index) => {
    const newList = [...subList.slice(0, index), ...subList.slice(index + 1)]

    setSubList(newList) // Update the state with the filtered list
  }

  console.log('sublist', subList)

  return (
    <div className="form-div">
      <h3 style={{ color: '#fff' }}>Edit a Category</h3>
      <div>
        <form>
          <label htmlFor="email">Category Name:</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
          <label htmlFor="email">Budget:</label>
          <input
            type="text"
            id="budget"
            onChange={(e) => setBudget(e.target.value)}
            value={budget}
            required
          />

          <div className="edit-btn-div">
            <button onClick={(e) => handleSubmit(e)} className="main-btn">
              Edit Category
            </button>
            <button onClick={() => close()} className="main-btn-signin">
              Cancel
            </button>
          </div>

          <label htmlFor="email">Add Sub Category:</label>
          <input
            type="checkbox"
            id="addSub"
            onChange={(e) => setAddSub(true)}
            value={addSub}
            required
            className="checkmark"
          />
          {/* 
          {subList.length !== 0 && (
            <div>
              {subList.map((item, index) => (
                <div className="sub-show-div">
                  <p>Name: {item.categoryName}</p>
                  <p>Budget: {item.budget}</p>
                  <RiDeleteBin5Fill
                    className="icon"
                    onClick={() => removeItem(index)}
                  />
                </div>
              ))}
            </div>
          )} */}

          {addSub && (
            <AddForm
              parent={'4'}
              addFunc={(e, item) => addSubCat(e, item)}
              close={(e) => {
                setAddSub(false)
                setSubList([])
              }}
            />
          )}

          {/* Pass parent category name */}
        </form>
      </div>
    </div>
  )
}

export default CategoryEditForm

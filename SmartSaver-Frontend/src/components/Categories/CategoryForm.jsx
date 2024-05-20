import React from 'react'
import { useState } from 'react'
import './category.css'
import axios from 'axios'
import AddForm from './AddForm'

const CategoryForm = ({ handleFunc, action, item }) => {
  const [name, setName] = useState('')
  const [isRoot, setIsRoot] = useState('')
  const [budget, setBudget] = useState('')
  const [addSub, setAddSub] = useState('')
  const [subList, setSubList] = useState([])

  const handleSubmit = async (e) => {
    console.log('in handle')
    const user = JSON.parse(localStorage.getItem('user'))
    e.preventDefault()
    const body = {
      categoryName: name,
      budget,
      userId: user.userId,
      parentCategoryId: '0',
      categoryId: 11,
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

      setName('')
      setBudget('')
      setSubList([])
    } catch (err) {
      console.log('error in add', err)
    }
  }

  return (
    <div className="form-div">
      <h3 style={{ color: '#fff' }}>Add a new Category</h3>
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

          {/* <label htmlFor="email">Add Sub Category:</label>
          <input
            type="checkbox"
            id="addSub"
            onChange={(e) => {
              setAddSub(!addSub)
              setIsRoot(true)
            }}
            value={addSub}
            required
            className="checkmark"
          /> */}

          {/* {subList.length !== 0 && (
          <div>
            {subList.map((item) => (
              <div className="sub-show-div">
                <p>Name: {item.categoryName}</p>
                <p>Budget: {item.budget}</p>
              </div>
            ))}
          </div>
          )} */}

          {/* {addSub && (
            <AddForm
              parent={'4'}
              addFunc={(item) => addItemFunc(item)}
              close={() => setAddSub(false)}
            />
          )} */}

          {/* Pass parent category name */}
          <button onClick={(e) => handleSubmit(e)} className="main-btn">
            Add New
          </button>
        </form>
      </div>
    </div>
  )
}

export default CategoryForm

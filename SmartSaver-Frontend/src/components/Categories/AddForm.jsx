import React from 'react'
import { useRef, useState, useEffect } from 'react'
import './category.css'

const AddForm = ({ addFunc, close }) => {
  const [name, setName] = useState('')
  const [isRoot, setIsRoot] = useState('')
  const [budget, setBudget] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('in sub add')
    addFunc(e, {
      categoryName: name,
      budget,
    })
    setName('')
    setBudget('')
  }
  return (
    <div>
      <form className="form-add-sub">
        <label htmlFor="email">Sub Category Name:</label>
        <input
          type="text"
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <label htmlFor="email"> Sub Category Budget:</label>
        <input
          type="text"
          id="budget"
          onChange={(e) => setBudget(e.target.value)}
          value={budget}
          required
        />

        <div className="edit-btn-div">
          <button onClick={(e) => handleSubmit(e)} className="small-btn">
            Add
          </button>
          <button onClick={() => close()} className="close-small-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddForm

import React from 'react'
import { useState, useEffect } from 'react'
import './category.css'
import axios from 'axios'
import CategoryForm from './CategoryForm'
import CategoryEditForm from './CategoryEdit'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'

const Category = () => {
  const [catList, setCatList] = useState(null)
  const [action, setAction] = useState('Add')
  const [item, setItem] = useState({
    categoryName: '',
    parentCategoryId: 0,
    budget: 0,
  })

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

      // console.log(response?.data)

      setCatList(response?.data)
    } catch (err) {
      console.log('error in get', err)
    }
  }

  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/category/${id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      getCategories()
    } catch (err) {
      console.log('error in delete', err)
    }
  }

  return (
    <React.Fragment>
      <section className="expense-section">
        <div className="exp-div1">
          <div className="exp-heading-div">
            <h3>Categories</h3>
          </div>
          {catList !== null && (
            <div className="grid-div">
              {catList.map((item) => (
                <div class="grid-item">
                  <div className="cat-div">
                    <p className="cat-head">{item.categoryName}</p>
                    <div className="col-div">
                      <FaRegEdit
                        className="icon"
                        onClick={() => {
                          setAction('Edit')
                          setItem(item)
                        }}
                        style={{ marginLeft: '10px' }}
                      />
                      <RiDeleteBin5Fill
                        className="icon"
                        onClick={() => deleteCategory(item.categoryId)}
                      />
                    </div>
                  </div>
                  {item.subCategories.map((item1) => (
                    <div className="sub-cat-div">
                      {/* <GoDotFill className="icon" />
                      <p className="sub-cat-head">{item1.categoryName}</p> */}
                      <button
                        onClick={() => {
                          setAction('Edit')
                          setItem(item1)
                        }}
                        className="small-edit"
                      >
                        {item1.categoryName}
                      </button>
                      <RiDeleteBin5Fill
                        className="icon"
                        onClick={() => deleteCategory(item1.categoryId)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="exp-div2">
          {action === 'Add' ? (
            <CategoryForm handleFunc={() => getCategories()} />
          ) : (
            <CategoryEditForm
              handleFunc={() => getCategories()}
              close={() => {
                setAction('Add')
                setItem({
                  categoryName: '',
                  parentCategoryId: 0,
                  budget: 0,
                })
              }}
              item={item}
            />
          )}
        </div>
      </section>
    </React.Fragment>
  )
}

export default Category

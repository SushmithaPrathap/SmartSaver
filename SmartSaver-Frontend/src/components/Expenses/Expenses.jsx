import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './expense.css'
import axios from 'axios'
import ExpenseForm from './ExpenseForm'
import ExpenseEditForm from './ExpenseEditForm'
import { RiDeleteBin5Fill } from 'react-icons/ri'

const Expenses = () => {
  const [expList, setExpList] = useState(null)
  const [action, setAction] = useState('Add')
  const [exp, setExp] = useState({
    name: '',
    amount: '',
    date: '',
    type: '',
    description: '',
    category: '',
  })

  const [catList, setCatList] = useState(null)

  useEffect(() => {
    getTransactions()
  }, [])

  const deleteTransaction = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/transactions/${id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      getTransactions()
    } catch (err) {
      console.log('error in delete', err)
    }
  }

  const getTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const response = await axios.get(
        `http://localhost:8080/api/transactions/user/${user.userId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      makeList(response)
    } catch (err) {
      console.log('error in get', err)
    }
  }

  const sortByDate = async (e) => {
    e.preventDefault()
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const response = await axios.get(
        `http://localhost:8080/api/transactions/sortByDate/${user.userId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      makeList(response)
    } catch (err) {
      console.log('error in delete', err)
    }
  }

  const makeList = async (response) => {
    const response1 = await axios.get(`http://localhost:8080/api/category`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })

    setCatList(response1?.data)
    const newList = response?.data.map((item) => {
      const category = response1?.data.find((i) => {
        if (i.categoryId === item.categoryId) {
          return true
        }
        const sub = i.subCategories.find(
          (sub) => sub.categoryId === item.categoryId
        )
        if (sub !== undefined) {
          return true
        }
        return false
      })

      // Construct a new category object only if a subcategory match was found
      const newCategory = category
        ? {
            ...category,
            subCat: category.subCategories?.find(
              (sub) => sub.categoryId === item.categoryId
            ),
          }
        : undefined

      return {
        transaction: item,
        category: newCategory, // This will include the subCat only when relevant
      }
    })

    // console.log('new', newList)

    setExpList(newList)
  }

  return (
    <React.Fragment>
      <section className="expense-section">
        <div className="exp-div1">
          <div className="exp-heading-div">
            <h3>Transactions</h3>
            <div className="exp-heading-div1">
              <h6 onClick={(e) => sortByDate(e)}>Sort By Date</h6>
              {/* <h6>Sort By Type</h6> */}
            </div>
          </div>

          {expList !== null && (
            <table striped bordered hover>
              <thead className="t-head">
                <tr>
                  <th>Transaction</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {expList.map((item) => (
                  <tr key={item.transaction.trasactionId}>
                    <td
                      onClick={() => {
                        setAction('Edit')
                        setExp(item)
                      }}
                    >
                      {item.transaction.name}
                    </td>
                    <td
                      onClick={() => {
                        setAction('Edit')
                        setExp(item)
                      }}
                    >
                      {item.transaction.amount}
                    </td>
                    <td
                      onClick={() => {
                        setAction('Edit')
                        setExp(item)
                      }}
                    >
                      {item.transaction.date}
                    </td>
                    {item.category.subCat === undefined ? (
                      <td
                        onClick={() => {
                          setAction('Edit')
                          setExp(item)
                        }}
                      >
                        {item.category.categoryName}
                      </td>
                    ) : (
                      <td
                        onClick={() => {
                          setAction('Edit')
                          setExp(item)
                        }}
                      >
                        <span className="cat-head">
                          {item.category.categoryName} -
                        </span>
                        {item.category.subCat.categoryName}
                      </td>
                    )}

                    <td
                      onClick={() => {
                        setAction('Edit')
                        setExp(item)
                      }}
                    >
                      {item.transaction.type}
                    </td>
                    <td>
                      <RiDeleteBin5Fill
                        className="icon"
                        onClick={() =>
                          deleteTransaction(item.transaction.transactionId)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="exp-div2">
          {action === 'Add' ? (
            <ExpenseForm handleFunc={() => getTransactions()} />
          ) : (
            <ExpenseEditForm
              handleFunc={() => getTransactions()}
              item={exp}
              close={() => {
                setAction('Add')
              }}
            />
          )}
        </div>
      </section>
    </React.Fragment>
  )
}

export default Expenses

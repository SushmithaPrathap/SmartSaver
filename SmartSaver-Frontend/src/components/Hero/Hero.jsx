import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DonutChart from 'react-donut-chart'
import './hero.css'
import axios from 'axios'
import AddTransactions from './AddTransactions'

const Hero = () => {
  const navigate = useNavigate()
  const [graphList, setGraphList] = useState([
    {
      label: 'Label',
      value: 0,
    },
  ])
  const [expList, setExpList] = useState([])
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user == null) {
      navigate('/signin')
    }
    getTransactions()
  }, [])

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

  const makeList = async (response) => {
    const response1 = await axios.get(`http://localhost:8080/api/category`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
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

    let totalArray = newList.map((item) => {
      return {
        label: item.transaction.name,
        value: item.transaction.amount,
      }
    })

    // console.log('new', newList, totalArray)

    setGraphList(totalArray)
    setExpList(newList)
  }

  const calTotal = () => {
    if (expList.length !== 0) {
      let total = 0
      expList.map((item) => {
        total = total + item.transaction.amount
      })
      return total
    }
  }

  return (
    <React.Fragment>
      <section className="hero-section">
        <h3>Welcome to your expenses!</h3>
        <div className="hero-main">
          <div className="hero-div1">
            <div className="hero-div1-1">
              <div onClick={() => navigate('/expenses')} className="card">
                <div>
                  <p className="card-text">Transactions</p>
                </div>

                <p className="card-text2">Track all your transactions here</p>
              </div>
              <div onClick={() => navigate('/categories')} className="card">
                <p className="card-text">Categories</p>
                <p className="card-text2">Create and Manage Categories here</p>
              </div>
            </div>
            <div className="hero-dash">
              {expList !== null && (
                <table striped bordered hover>
                  <thead className="t-head">
                    <tr>
                      <th>Transaction</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expList.map((item) => (
                      <tr key={item.transaction.trasactionId}>
                        <td>{item.transaction.name}</td>
                        <td>{item.transaction.amount}</td>
                        <td>{item.transaction.date}</td>
                        {item.category.subCat === undefined ? (
                          <td>{item.category.categoryName}</td>
                        ) : (
                          <td>
                            <span className="cat-head">
                              {item.category.categoryName} -
                            </span>
                            {item.category.subCat.categoryName}
                          </td>
                        )}

                        <td>{item.transaction.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="hero-chart-div">
                <h3>Total Expense Chart</h3>
                <div className="chart-div">
                  <DonutChart data={graphList} width={'700'} height={'450'} />
                </div>
                <div className="total-div">
                  <h2>Total Amount Spent:</h2> <p>{calTotal()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-div2">
            <AddTransactions handleFunc={() => getTransactions()} />
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default Hero

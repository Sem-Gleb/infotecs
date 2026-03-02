import { useEffect, useState } from 'react'

const BASE_URL = 'https://dummyjson.com/users'

export function useUsers({ page, pageSize, sortField, sortOrder }) {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const params = new URLSearchParams()
    params.set('limit', pageSize.toString())
    params.set('skip', ((page - 1) * pageSize).toString())

    if (sortField && sortOrder) {
      params.set('sortBy', sortField)
      params.set('order', sortOrder)
    }

    const url = `${BASE_URL}?${params.toString()}`

    setLoading(true)
    setError(null)

    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setUsers(Array.isArray(data.users) ? data.users : [])
        setTotal(typeof data.total === 'number' ? data.total : 0)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Неизвестная ошибка')
      })
      .finally(() => {
        if (!signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [page, pageSize, sortField, sortOrder])

  return { users, total, loading, error }
}


import { useMemo, useState } from 'react'
import './App.css'
import { useUsers } from './hooks/useUsers'
import { UserTable } from './components/UserTable'
import { UserModal } from './components/UserModal'

const PAGE_SIZE = 10

function App() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ field: null, order: null })

  const [filters, setFilters] = useState({
    name: '',
    gender: '',
    country: '',
    city: '',
    email: '',
    phone: '',
  })

  const [columnWidths, setColumnWidths] = useState({
    lastName: 140,
    firstName: 140,
    maidenName: 160,
    age: 90,
    gender: 110,
    phone: 160,
    email: 220,
    country: 150,
    city: 150,
  })

  const [selectedUser, setSelectedUser] = useState(null)

  const { users, total, loading, error } = useUsers({
    page,
    pageSize: PAGE_SIZE,
    sortField: sort.field,
    sortOrder: sort.order,
  })

  const handleSortChange = (field) => {
    setPage(1)
    setSort((prev) => {
      if (prev.field !== field) {
        return { field, order: 'asc' }
      }
      if (prev.order === 'asc') {
        return { field, order: 'desc' }
      }
      return { field: null, order: null }
    })
  }

  const handleFilterChange = (name, value) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.lastName ?? ''} ${user.firstName ?? ''} ${user.maidenName ?? ''}`
        .toLowerCase()
        .trim()

      const matchesName =
        !filters.name ||
        fullName.includes(filters.name.toLowerCase().trim())

      const matchesGender =
        !filters.gender ||
        (user.gender ?? '').toLowerCase() === filters.gender.toLowerCase()

      const matchesCountry =
        !filters.country ||
        (user.address?.country ?? '')
          .toLowerCase()
          .includes(filters.country.toLowerCase().trim())

      const matchesCity =
        !filters.city ||
        (user.address?.city ?? '')
          .toLowerCase()
          .includes(filters.city.toLowerCase().trim())

      const matchesEmail =
        !filters.email ||
        (user.email ?? '')
          .toLowerCase()
          .includes(filters.email.toLowerCase().trim())

      const matchesPhone =
        !filters.phone ||
        (user.phone ?? '')
          .toLowerCase()
          .includes(filters.phone.toLowerCase().trim())

      return (
        matchesName &&
        matchesGender &&
        matchesCountry &&
        matchesCity &&
        matchesEmail &&
        matchesPhone
      )
    })
  }, [users, filters])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleColumnResizeStart = (columnKey, startX) => {
    const startWidth = columnWidths[columnKey] ?? 120

    const handleMouseMove = (event) => {
      const delta = event.clientX - startX
      const nextWidth = Math.max(50, startWidth + delta)

      setColumnWidths((prev) => ({
        ...prev,
        [columnKey]: nextWidth,
      }))
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleRetry = () => {
    // Trigger refetch by toggling page (simple approach)
    setPage((prev) => (prev === 1 ? 2 : 1))
    setTimeout(() => setPage(1), 0)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Таблица пользователей</h1>
        <p className="app-subtitle">
          Данные с DummyJSON, сортировка по HTTP-запросам, фильтры, пагинация и модальное окно.
        </p>
      </header>

      <section className="filters">
        <div className="filters-row">
          <label className="filter-field">
            <span>ФИО</span>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              placeholder="Поиск по ФИО"
            />
          </label>
          <label className="filter-field">
            <span>Пол</span>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">Любой</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </label>
          <label className="filter-field">
            <span>Страна</span>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              placeholder="Фильтр по стране"
            />
          </label>
          <label className="filter-field">
            <span>Город</span>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Фильтр по городу"
            />
          </label>
        </div>
        <div className="filters-row">
          <label className="filter-field">
            <span>Email</span>
            <input
              type="text"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              placeholder="Фильтр по email"
            />
          </label>
          <label className="filter-field">
            <span>Телефон</span>
            <input
              type="text"
              value={filters.phone}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
              placeholder="Фильтр по телефону"
            />
          </label>
        </div>
      </section>

      <section className="table-section">
        {error && (
          <div className="alert alert-error">
            <div>Ошибка загрузки данных: {error}</div>
            <button type="button" onClick={handleRetry} className="button-secondary">
              Повторить попытку
            </button>
          </div>
        )}

        <UserTable
          users={filteredUsers}
          loading={loading}
          sortField={sort.field}
          sortOrder={sort.order}
          onSortChange={handleSortChange}
          onRowClick={setSelectedUser}
          columnWidths={columnWidths}
          onColumnResizeStart={handleColumnResizeStart}
        />

        <div className="table-footer">
          <div className="pagination">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || loading}
            >
              Назад
            </button>
            <span>
              Страница {page} из {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages || loading}
            >
              Вперед
            </button>
          </div>

          <div className="table-meta">
            <span>Всего пользователей: {total}</span>
          </div>
        </div>
      </section>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

export default App

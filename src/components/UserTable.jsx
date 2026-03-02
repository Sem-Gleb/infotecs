export function UserTable({
  users,
  loading,
  sortField,
  sortOrder,
  onSortChange,
  onRowClick,
  columnWidths,
  onColumnResizeStart,
}) {
  const columns = [
    { key: 'lastName', label: 'Фамилия', sortable: true },
    { key: 'firstName', label: 'Имя', sortable: true },
    { key: 'maidenName', label: 'Отчество', sortable: true },
    { key: 'age', label: 'Возраст', sortable: true },
    { key: 'gender', label: 'Пол', sortable: true },
    { key: 'phone', label: 'Телефон', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'country', label: 'Страна', sortable: false },
    { key: 'city', label: 'Город', sortable: false },
  ]

  const getSortIndicator = (key) => {
    if (sortField !== key) return '⇅'
    if (sortOrder === 'asc') return '▲'
    if (sortOrder === 'desc') return '▼'
    return '⇅'
  }

  return (
    <div className="table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  width: columnWidths[column.key],
                  minWidth: 50,
                }}
              >
                <div className="th-content">
                  <button
                    type="button"
                    className={`th-button ${column.sortable ? 'sortable' : ''}`}
                    onClick={
                      column.sortable
                        ? () => onSortChange(column.key === 'country' || column.key === 'city'
                          ? null
                          : column.key)
                        : undefined
                    }
                  >
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="sort-indicator">
                        {getSortIndicator(column.key)}
                      </span>
                    )}
                  </button>
                  <div
                    className="column-resizer"
                    onMouseDown={(event) =>
                      onColumnResizeStart(column.key, event.clientX)
                    }
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="table-loading">
                Загрузка пользователей...
              </td>
            </tr>
          )}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                Нет данных для отображения
              </td>
            </tr>
          )}
          {!loading &&
            users.map((user) => (
              <tr
                key={user.id}
                onClick={() => onRowClick(user)}
                className="table-row"
              >
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{user.maidenName}</td>
                <td>{user.age}</td>
                <td>{user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : user.gender}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.address?.country}</td>
                <td>{user.address?.city}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}


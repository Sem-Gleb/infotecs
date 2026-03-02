export function UserModal({ user, onClose }) {
  if (!user) return null

  const fullName = `${user.lastName ?? ''} ${user.firstName ?? ''} ${user.maidenName ?? ''}`.trim()

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2>{fullName}</h2>
            <p className="modal-subtitle">Подробная информация о пользователе</p>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <div className="modal-body">
          <div className="modal-main">
            <div className="modal-row">
              <span className="modal-label">Возраст:</span>
              <span>{user.age}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Пол:</span>
              <span>
                {user.gender === 'male'
                  ? 'Мужской'
                  : user.gender === 'female'
                    ? 'Женский'
                    : user.gender}
              </span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Рост:</span>
              <span>{user.height} см</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Вес:</span>
              <span>{user.weight} кг</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Телефон:</span>
              <span>{user.phone}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Адрес:</span>
              <span>
                {[
                  user.address?.address,
                  user.address?.city,
                  user.address?.state,
                  user.address?.country,
                  user.address?.postalCode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          </div>

          <div className="modal-side">
            {user.image && (
              <img
                src={user.image}
                alt={fullName}
                className="modal-avatar"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


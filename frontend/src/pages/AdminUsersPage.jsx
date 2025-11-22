import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAdminUsers } from '../mockData.js';

const roleLabel = (role) => {
  if (role === 'admin') return 'Администратор';
  if (role === 'coordinator') return 'Координатор';
  if (role === 'reception') return 'Ресепшен';
  return role;
};

export default function AdminUsersPage() {
  const navigate = useNavigate();

  const handleOpenUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  return (
    <section className='mt-3'>
      <div className='d-flex justify-content-between align-items-start mb-3'>
        <div>
          <h1 className='h4 mb-1'>Пользователи и роли</h1>
          <p className='text-muted small mb-0'>
            Назначайте роли, управляйте статусом доступа и отслеживайте
            активность пользователей системы.
          </p>
        </div>
      </div>

      <div className='card shadow-sm'>
        <div className='card-body'>
          <div className='table-responsive small'>
            <table className='table align-middle mb-0'>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>E-mail</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Мероприятий</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {mockAdminUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 'admin' && (
                        <span className='badge bg-primary-subtle text-primary-emphasis'>
                          {roleLabel(user.role)}
                        </span>
                      )}
                      {user.role === 'coordinator' && (
                        <span className='badge bg-success-subtle text-success-emphasis'>
                          {roleLabel(user.role)}
                        </span>
                      )}
                      {user.role === 'reception' && (
                        <span className='badge bg-info-subtle text-info-emphasis'>
                          {roleLabel(user.role)}
                        </span>
                      )}
                    </td>
                    <td>
                      {user.status === 'active' && (
                        <span className='status-pill status-accepted'>
                          Активен
                        </span>
                      )}
                      {user.status === 'blocked' && (
                        <span className='status-pill status-declined'>
                          Заблокирован
                        </span>
                      )}
                    </td>
                    <td>{user.eventsCount}</td>
                    <td className='text-end'>
                      <button
                        type='button'
                        className='btn btn-outline-primary btn-sm'
                        onClick={() => handleOpenUser(user.id)}
                      >
                        Открыть
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='small text-muted mb-0 mt-2'>
            Таблица позволяет быстро найти нужный аккаунт и перейти к настройкам
            конкретного пользователя.
          </p>
        </div>
      </div>
    </section>
  );
}

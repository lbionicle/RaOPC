import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockAdminUsers } from '../mockData.js';

export default function AdminUserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = mockAdminUsers.find((u) => u.id === userId) || mockAdminUsers[0];

  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const handleBack = () => {
    navigate('/admin/users');
  };

  const handleSave = () => {
    alert('Настройки роли и статуса пользователя сохранены.');
  };

  const handleResetPassword = () => {
    alert('Ссылка для сброса пароля отправлена пользователю на e-mail.');
  };

  return (
    <section className='mt-3'>
      <div className='d-flex align-items-start justify-content-between mb-3'>
        <button className='btn btn-link px-0' onClick={handleBack}>
          ← К списку пользователей
        </button>
        <div className='text-end d-none d-md-block' />
      </div>

      <div className='mb-3'>
        <h1 className='h4 mb-1'>{user.name}</h1>
        <p className='text-muted small mb-0'>
          Управление доступом к системе и основными параметрами учётной записи.
        </p>
      </div>

      <div className='row g-3'>
        <div className='col-lg-7'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h2 className='h6 mb-3'>Учётная запись</h2>

              <div className='mb-3'>
                <label className='form-label small'>Имя пользователя</label>
                <input className='form-control' value={user.name} readOnly />
              </div>

              <div className='mb-3'>
                <label className='form-label small'>E-mail</label>
                <input className='form-control' value={user.email} readOnly />
              </div>

              <div className='mb-3'>
                <label className='form-label small'>Роль в системе</label>
                <select
                  className='form-select'
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value='admin'>Администратор</option>
                  <option value='coordinator'>Координатор</option>
                  <option value='reception'>Ресепшен</option>
                </select>
                <div className='form-text small'>
                  Роль определяет доступ пользователя к разделам Planora.
                </div>
              </div>

              <div className='mb-3'>
                <label className='form-label small d-block'>
                  Статус доступа
                </label>
                <div className='d-flex gap-3 small'>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='radio'
                      name='status'
                      id='status-active'
                      value='active'
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                    />
                    <label className='form-check-label' htmlFor='status-active'>
                      Активен
                    </label>
                  </div>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='radio'
                      name='status'
                      id='status-blocked'
                      value='blocked'
                      checked={status === 'blocked'}
                      onChange={() => setStatus('blocked')}
                    />
                    <label
                      className='form-check-label'
                      htmlFor='status-blocked'
                    >
                      Заблокирован
                    </label>
                  </div>
                </div>
              </div>

              <div className='d-flex gap-2 mt-3'>
                <button className='btn btn-primary' onClick={handleSave}>
                  Сохранить изменения
                </button>
                <button
                  className='btn btn-outline-secondary'
                  onClick={handleResetPassword}
                >
                  Сбросить пароль
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='col-lg-5'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h2 className='h6 mb-2'>Активность пользователя</h2>
              <p className='small text-muted mb-3'>
                Краткая статистика по работе пользователя в системе.
              </p>
              <ul className='small mb-2'>
                <li>
                  Роль:{' '}
                  {role === 'admin'
                    ? 'Администратор'
                    : role === 'coordinator'
                    ? 'Координатор'
                    : 'Ресепшен'}
                </li>
                <li>
                  Статус: {status === 'active' ? 'Активен' : 'Заблокирован'}
                </li>
                <li>Связано мероприятий: {user.eventsCount}</li>
                <li>Последний вход: {user.lastLogin}</li>
              </ul>
              <div className='alert alert-secondary small mb-0'>
                При необходимости раздел может быть дополнен историей действий,
                журнальными записями и расширенной аналитикой.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

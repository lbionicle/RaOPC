import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAdminUsers } from '../mockData.js';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const totalUsers = mockAdminUsers.length;
  const coordinators = mockAdminUsers.filter(
    (u) => u.role === 'coordinator'
  ).length;
  const receptions = mockAdminUsers.filter(
    (u) => u.role === 'reception'
  ).length;
  const admins = mockAdminUsers.filter((u) => u.role === 'admin').length;

  return (
    <section className='mt-3'>
      <div className='mb-3'>
        <h1 className='h3 mb-1'>Администрирование системы</h1>
        <p className='text-muted mb-0'>
          Управление пользователями, ролями и ключевыми настройками Planora.
        </p>
      </div>

      <div className='row g-3 mb-3'>
        <div className='col-md-4'>
          <div className='card shadow-sm h-100'>
            <div className='card-body'>
              <h2 className='h6 mb-2'>Пользователи и роли</h2>
              <p className='small text-muted mb-3'>
                Управление аккаунтами, распределением ролей и доступом к
                разделам системы.
              </p>
              <ul className='small mb-3'>
                <li>Всего пользователей: {totalUsers}</li>
                <li>Координаторов: {coordinators}</li>
                <li>Ресепшен: {receptions}</li>
                <li>Администраторов: {admins}</li>
              </ul>
              <button
                type='button'
                className='btn btn-outline-primary btn-sm'
                onClick={() => navigate('/admin/users')}
              >
                Открыть список пользователей
              </button>
            </div>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='card shadow-sm h-100'>
            <div className='card-body'>
              <h2 className='h6 mb-2'>Интеграции</h2>
              <p className='small text-muted mb-3'>
                Почтовые сервисы, SSO, календари и другие внешние системы, с
                которыми работает Planora.
              </p>
              <div className='alert alert-secondary small mb-0'>
                Раздел предназначен для настройки подключений к корпоративной
                инфраструктуре и службам уведомлений.
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='card shadow-sm h-100'>
            <div className='card-body'>
              <h2 className='h6 mb-2'>Справочники</h2>
              <p className='small text-muted mb-3'>
                Локации, типы мероприятий, шаблоны сообщений и другие параметры,
                используемые при планировании событий.
              </p>
              <div className='alert alert-secondary small mb-0'>
                Здесь можно централизованно поддерживать структуру данных,
                используемых координаторами при работе с мероприятиями.
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className='small text-muted mb-0'>
        На основе этого раздела администратор контролирует доступ и поддерживает
        корректную работу всей системы Planora.
      </p>
    </section>
  );
}

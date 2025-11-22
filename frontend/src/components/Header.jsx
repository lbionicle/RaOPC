import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const path = location.pathname || '';

  let roleLabel = 'Planora';
  let avatarText = 'P';

  if (path.startsWith('/coordinator')) {
    roleLabel = 'Координатор';
    avatarText = 'К';
  } else if (path.startsWith('/attendee')) {
    roleLabel = 'Приглашённый участник';
    avatarText = 'П';
  } else if (path.startsWith('/reception')) {
    roleLabel = 'Ресепшен';
    avatarText = 'Р';
  } else if (path.startsWith('/admin')) {
    roleLabel = 'Администратор';
    avatarText = 'А';
  }

  return (
    <header className='app-header border-bottom bg-white'>
      <div className='container d-flex align-items-center justify-content-between py-2'>
        <div className='d-flex align-items-center gap-3'>
          <img src='/Logo.svg' alt='Логотип Planora' className='planora-logo' />
          <div>
            <div className='fw-semibold'>Planora</div>
            <div className='text-muted small'>
              Корпоративные мероприятия с RSVP
            </div>
          </div>
        </div>
        <div className='d-flex align-items-center gap-2'>
          <span className='text-muted small'>{roleLabel}</span>
          <div className='avatar-circle'>{avatarText}</div>
        </div>
      </div>
    </header>
  );
}

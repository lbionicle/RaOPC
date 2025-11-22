import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockEvents, mockGuests } from '../mockData.js';

const emptyEvent = {
  id: 'new',
  name: '',
  date: '',
  time: '',
  location: '',
  status: 'draft',
  description: '',
  rsvpAccepted: 0,
  rsvpPending: 0,
  rsvpDeclined: 0,
};

export default function CoordinatorEventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event =
    !id || id === 'new'
      ? emptyEvent
      : mockEvents.find((e) => e.id === id) || emptyEvent;

  const handleBack = () => {
    navigate('/coordinator/events');
  };

  const handleSaveDraft = () => {
    alert('Черновик события сохранён.');
  };

  const handleSendInvites = () => {
    alert('Рассылка приглашений запущена.');
  };

  const handleAddGuest = () => {
    alert(
      'Открыта точка для добавления гостя. Функция может быть расширена формой и импортом списка.'
    );
  };

  return (
    <section>
      <div className='d-flex align-items-start justify-content-between mb-3'>
        <button className='btn btn-link px-0' onClick={handleBack}>
          ← К списку мероприятий
        </button>
        <div className='text-end d-none d-md-block' />
      </div>

      <div className='mb-3'>
        <h1 className='h3 mb-1'>
          {event.id === 'new' ? 'Новое мероприятие' : event.name}
        </h1>
        <p className='text-muted mb-0'>
          Заполните основные параметры события, добавьте гостей и подготовьте
          рассылку приглашений.
        </p>
      </div>

      <div className='row g-3'>
        <div className='col-lg-7'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h2 className='h5 mb-3'>Основная информация</h2>
              <div className='row g-3'>
                <div className='col-12'>
                  <label className='form-label small'>Название события</label>
                  <input
                    className='form-control'
                    defaultValue={event.name}
                    placeholder='Например: Демодень продукта'
                  />
                </div>
                <div className='col-sm-6'>
                  <label className='form-label small'>Дата</label>
                  <input
                    className='form-control'
                    defaultValue={event.date}
                    placeholder='дд.мм.гггг'
                  />
                </div>
                <div className='col-sm-6'>
                  <label className='form-label small'>Время</label>
                  <input
                    className='form-control'
                    defaultValue={event.time}
                    placeholder='чч:мм'
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label small'>Место проведения</label>
                  <input
                    className='form-control'
                    defaultValue={event.location}
                    placeholder='Адрес площадки или ссылка на онлайн–встречу'
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label small'>Краткое описание</label>
                  <textarea
                    className='form-control'
                    rows={3}
                    defaultValue={event.description}
                    placeholder='Что будет на мероприятии и что важно знать участникам.'
                  />
                </div>
              </div>
              <div className='d-flex gap-2 mt-3'>
                <button className='btn btn-primary' onClick={handleSaveDraft}>
                  Сохранить черновик
                </button>
                <button
                  className='btn btn-outline-primary'
                  onClick={handleSendInvites}
                >
                  Отправить приглашения
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='col-lg-5 d-flex flex-column gap-3'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h2 className='h6 mb-2'>Отклики RSVP</h2>
              <p className='small text-muted'>
                Сводная статистика по статусам ответов на приглашение.
              </p>
              <div className='row g-2'>
                <div className='col-4'>
                  <div className='rsvp-tile rsvp-accent'>
                    <div className='rsvp-label'>Пойдут</div>
                    <div className='rsvp-value'>{event.rsvpAccepted}</div>
                  </div>
                </div>
                <div className='col-4'>
                  <div className='rsvp-tile rsvp-neutral'>
                    <div className='rsvp-label'>Не решили</div>
                    <div className='rsvp-value'>{event.rsvpPending}</div>
                  </div>
                </div>
                <div className='col-4'>
                  <div className='rsvp-tile rsvp-danger'>
                    <div className='rsvp-label'>Не смогут</div>
                    <div className='rsvp-value'>{event.rsvpDeclined}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='card shadow-sm'>
            <div className='card-body'>
              <div className='d-flex justify-content-between align-items-start mb-2'>
                <div>
                  <h2 className='h6 mb-1'>Приглашённые</h2>
                  <p className='small text-muted mb-0'>
                    Список участников, которым отправлены или планируются
                    приглашения.
                  </p>
                </div>
                <button className='btn btn-link p-0' onClick={handleAddGuest}>
                  + Добавить гостя
                </button>
              </div>

              <div className='table-responsive small'>
                <table className='table align-middle mb-0'>
                  <thead>
                    <tr>
                      <th>Имя</th>
                      <th>E-mail</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockGuests.map((guest) => (
                      <tr key={guest.id}>
                        <td>{guest.name}</td>
                        <td>{guest.email}</td>
                        <td>
                          <span
                            className={`status-pill status-${guest.status}`}
                          >
                            {guest.status === 'accepted' && 'Пойдёт'}
                            {guest.status === 'pending' && 'Не решил'}
                            {guest.status === 'declined' && 'Не пойдёт'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

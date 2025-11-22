import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockEvents } from '../mockData.js';

export default function AttendeeInvitePage() {
  const { eventId } = useParams();
  const event = mockEvents.find((e) => e.id === eventId);

  const [status, setStatus] = useState(null); // "accepted" | "declined"

  if (!event) {
    return (
      <section className='mt-4'>
        <div className='row justify-content-center'>
          <div className='col-md-8 col-lg-6'>
            <div className='card shadow-sm'>
              <div className='card-body'>
                <h1 className='h4 mb-2'>Приглашение недоступно</h1>
                <p className='small text-muted mb-0'>
                  Ссылка на мероприятие не найдена или срок её действия истёк.
                  Если вы считаете, что это ошибка, свяжитесь с координатором
                  мероприятия.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleRsvp = (value) => {
    setStatus(value);
    if (value === 'accepted') {
      alert('Вы выбрали статус «Пойду». Ваш ответ учтён.');
    } else {
      alert('Вы выбрали статус «Не смогу». Ваш ответ учтён.');
    }
  };

  return (
    <section className='mt-4'>
      <div className='row justify-content-center'>
        <div className='col-md-8 col-lg-6'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <p className='small text-muted mb-1'>Персональное приглашение</p>
              <h1 className='h4 mb-2'>{event.name}</h1>
              <p className='small text-muted mb-3'>
                {event.date} · {event.time} · {event.location}
              </p>
              <p className='small mb-4'>{event.description}</p>

              <p className='small mb-3'>
                Пожалуйста, подтвердите участие, выбрав один из вариантов ниже.
              </p>

              <div className='d-flex gap-2 mb-3'>
                <button
                  type='button'
                  className='btn btn-primary flex-fill'
                  onClick={() => handleRsvp('accepted')}
                >
                  Пойду
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary flex-fill'
                  onClick={() => handleRsvp('declined')}
                >
                  Не смогу
                </button>
              </div>

              {status && (
                <div className='alert alert-info small mb-0'>
                  {status === 'accepted' && (
                    <>
                      Текущий статус участия: <strong>«Пойду»</strong>. При
                      необходимости вы можете уточнить детали у координатора.
                    </>
                  )}
                  {status === 'declined' && (
                    <>
                      Текущий статус участия: <strong>«Не смогу»</strong>. Если
                      планы изменятся, свяжитесь с координатором мероприятия.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

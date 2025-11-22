import { useNavigate } from 'react-router-dom';
import { mockEvents } from '../mockData.js';

export default function CoordinatorEventsPage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/coordinator/events/new');
  };

  const handleOpen = (id) => {
    navigate(`/coordinator/events/${id}`);
  };

  return (
    <section>
      <div className='d-flex justify-content-between align-items-start mb-4'>
        <div>
          <h1 className='h3 mb-1'>Мои мероприятия</h1>
          <p className='text-muted mb-0'>
            Управляй событиями, приглашёнными и RSVP в одном интерфейсе Planora.
          </p>
        </div>
        <button className='btn btn-primary' onClick={handleCreate}>
          Создать мероприятие
        </button>
      </div>

      <div className='row g-3'>
        {mockEvents.map((event) => (
          <div key={event.id} className='col-md-6 col-lg-4'>
            <button
              type='button'
              className='card h-100 text-start shadow-sm border-0 event-card-btn'
              onClick={() => handleOpen(event.id)}
            >
              <div className='card-body d-flex flex-column'>
                <div className='d-flex justify-content-end mb-2'>
                  {event.status === 'active' && (
                    <span className='badge bg-success-subtle text-success-emphasis'>
                      Активно
                    </span>
                  )}
                  {event.status === 'draft' && (
                    <span className='badge bg-secondary-subtle text-secondary-emphasis'>
                      Черновик
                    </span>
                  )}
                  {event.status === 'archived' && (
                    <span className='badge bg-outline-secondary'>Архив</span>
                  )}
                </div>
                <h2 className='h5 mb-1'>{event.name}</h2>
                <p className='small text-muted mb-2'>
                  {event.date} · {event.time} · {event.location}
                </p>
                <p className='small flex-grow-1 mb-3'>{event.description}</p>
                <div className='d-flex gap-2'>
                  <div className='pill pill-accent'>
                    <span className='pill-label'>Пойдут</span>
                    <span className='pill-value'>{event.rsvpAccepted}</span>
                  </div>
                  <div className='pill pill-neutral'>
                    <span className='pill-label'>Не решили</span>
                    <span className='pill-value'>{event.rsvpPending}</span>
                  </div>
                  <div className='pill pill-danger'>
                    <span className='pill-label'>Не смогут</span>
                    <span className='pill-value'>{event.rsvpDeclined}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/coordinator/events');
  };

  return (
    <section className='hero-section'>
      <div className='row align-items-center g-4'>
        <div className='col-lg-6'>
          <div className='hero-tag mb-3'>Платформа для внутренних событий</div>
          <h1 className='hero-title'>
            Planora – управление корпоративными мероприятиями с RSVP
          </h1>
          <p className='hero-subtitle'>
            Планирование встреч и корпоративов, рассылка приглашений, сбор
            откликов и регистрация гостей в единой системе. Без бесконечных
            таблиц и потерянных писем.
          </p>
          <div className='d-flex flex-wrap gap-2 mt-3'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleEnter}
            >
              Войти в Planora
            </button>
            <button
              type='button'
              className='btn btn-outline-secondary'
              onClick={() => navigate('/admin')}
            >
              Панель администратора
            </button>
          </div>
        </div>

        <div className='col-lg-6'>
          <div className='hero-card'>
            <div className='hero-card-header'>
              <span className='hero-card-title'>Предстоящее событие</span>
              <span className='badge bg-success-subtle text-success-emphasis'>
                Активно
              </span>
            </div>
            <div className='hero-card-body'>
              <h2 className='h5 mb-1'>Командный митап Planora</h2>
              <p className='small text-muted mb-2'>
                25.11.2025 · 18:30 · Минск, офис, зал A
              </p>
              <p className='small mb-3'>
                Короткая встреча для команды с обзором релизов и планов по
                развитию продукта.
              </p>
              <div className='d-flex gap-2 mb-3'>
                <div className='pill pill-accent'>
                  <span className='pill-label'>Пойдут</span>
                  <span className='pill-value'>18</span>
                </div>
                <div className='pill pill-neutral'>
                  <span className='pill-label'>Не решили</span>
                  <span className='pill-value'>7</span>
                </div>
                <div className='pill pill-danger'>
                  <span className='pill-label'>Не смогут</span>
                  <span className='pill-value'>3</span>
                </div>
              </div>
              <div className='hero-card-footer small text-muted'>
                Координатор видит статусы участников в режиме реального времени
                и может оперативно готовить площадку.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Header from './Header.jsx';

export default function Layout({ children }) {
  return (
    <div className='app-root bg-light min-vh-100'>
      <Header />
      <main className='container py-4'>{children}</main>
    </div>
  );
}

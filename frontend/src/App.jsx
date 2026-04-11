import AdminDashboard from './pages/AdminDashboard';
import LecturerDashboard from './pages/LecturerDashboard';

function App() {
  // Change this to 'LECTURER' to see the restricted view!
  const userRole = 'LECTURER'; // or 'ADMIN'

  return (
    <div>
      {userRole === 'ADMIN' ? <AdminDashboard /> : <LecturerDashboard />}
    </div>
  );
}

export default App;

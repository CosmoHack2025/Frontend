import PatientProfile from '../pages/dashboard/PatientProfile';
import DoctorProfile from '../pages/dashboard/DoctorProfile';

function ProfileHolder() {
    const user = 'patient';
  return user === 'patient' ? <PatientProfile /> : <DoctorProfile />;
}

export default ProfileHolder
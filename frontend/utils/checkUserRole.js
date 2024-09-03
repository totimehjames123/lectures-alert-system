import { useSelector } from 'react-redux';
import { selectUserRole } from '../redux/userSlice';

const checkUserRole = () => {
  const userRole = useSelector(selectUserRole);

  if (userRole) {
    switch (userRole) {
      case 'Admin':
        return 'admin';
      case 'Lecturer':
        return 'lecturer';
      case 'Student':
        return 'student';
      default:
        console.log('Unknown user role:', userRole);
        return null;
    }
  } else {
    console.log('User role is not defined or user not found');
    return null;
  }
};

export default checkUserRole;

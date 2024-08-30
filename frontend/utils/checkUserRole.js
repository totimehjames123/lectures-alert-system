import getCurrentUser from './getCurrentUser';

const checkUserRole = async () => {
  try {
    const user = await getCurrentUser();

    if (user && user.role) {
      switch (user.role) {
        case 'Admin':
          return 'admin';
        case 'Lecturer':
          return 'lecturer';
        case 'Student':
          return 'student';
        default:
          return null;
      }
    } else {
      console.log('User role is not defined or user not found');
      return null;
    }
  } catch (e) {
    console.log('Error checking user role:', e);
    return null;
  }
};

export default checkUserRole;

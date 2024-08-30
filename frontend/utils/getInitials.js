
const getInitials = (fullname) => {
    if (!fullname) return '';

    // Split the fullname into parts (assumes space is the delimiter)
    const nameParts = fullname.trim().split(' ');

    // Get the first letter of the first name
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || '';

    // Get the last letter of the last name
    const lastInitial = nameParts[nameParts.length - 1]?.[0]?.toUpperCase() || '';

    return `${firstInitial}${lastInitial}`;
};

export default getInitials


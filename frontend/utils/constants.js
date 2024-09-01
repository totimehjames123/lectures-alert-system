const OnboardingScreenContent = [ 
  {
      pageNumber: "1",
      title: "Timely Alerts",
      subtitle: "Get instant notifications about upcoming lectures to never miss a class or meeting again.",
      image: require("../assets/splash.png")
  },
  {
      pageNumber: "2",
      title: "Efficient Scheduling",
      subtitle: "Easily view and manage your lecture schedules, ensuring you are always up to date with any changes.",
      image: require("../assets/splash.png")
  },
  {
      pageNumber: "3",
      title: "Stay Organized",
      subtitle: "Keep track of all your lecture timings and changes in one place, making it simple to stay organized and punctual.",
      image: require("../assets/splash.png")
  },
]




 const departments = [
    { label: 'Science', value: 'science' },
    { label: 'Commerce', value: 'commerce' },
    // Add more options as needed
  ];


  
  const levels = [
    { label: 'Level 100', value: 'Level 100' },
    { label: 'Level 200', value: 'Level 200' },
    { label: 'Level 300', value: 'Level 300' },
    { label: 'Level 400', value: 'Level 400' },
    // Add more options as needed
  ];

  const classes = [
    { label: 'CPS 1A', value: 'CPS 1A' },
    { label: 'CPS 1B', value: 'CPS 1B' },
    { label: 'CPS 1C', value: 'CPS 1C' },

    { label: 'CPS 2A', value: 'CPS 2A' },
    { label: 'CPS 2B', value: 'CPS 2B' },
    { label: 'CPS 2C', value: 'CPS 2C' },

    { label: 'CPS 3A', value: 'CPS 3A' },
    { label: 'CPS 3B', value: 'CPS 3B' },
    { label: 'CPS 3C', value: 'CPS 3C' },
    // Add more options as needed
  ];

  const roleOptions = [
    { label: 'Student', value: 'Student' },
    { label: 'Lecturer', value: 'Lecturer' },
  ];


  const days = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
];

  
  export  { OnboardingScreenContent, departments, classes, levels, roleOptions, days}

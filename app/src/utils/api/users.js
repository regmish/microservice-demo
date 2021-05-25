const dummyUser = {
  id: 1,
  firstName: 'Shankar',
  lastName: 'Regmi',
  email: 'shankarregmi@gmail.com'
};

export const me = () => new Promise((resolve) => resolve({ data: dummyUser }));
export const login = (data) => new Promise((resolve) => resolve({ data: dummyUser }));

export const getUsers = async (data: any) => {
  console.log('Received RPC call for listUsers ', JSON.stringify(data));

  return {
    users: [
      {
        name: 'Shankar Regmi',
        age: 30,
      },
      {
        name: 'Hasan Khadar',
        age: 30,
      },
    ],
  };
};

export const getUsers = async (data: any) => {
  console.log('Received RPC call for listUsers ', JSON.stringify(data));

  return {
    ...data,
    name: 'John Doe',
  };
};

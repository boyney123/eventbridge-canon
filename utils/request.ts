export const post = async (url: string, input: { body: any }) => {
  const response = await fetch(url, {
    body: JSON.stringify(input.body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return response.json();
};

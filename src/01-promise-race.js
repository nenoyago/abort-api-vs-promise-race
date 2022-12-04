// fetch é experimental, tem que lembrar de usar o --experimental-fetch
import assert from 'assert';

const url = 'http://localhost:3000';

async function race(request, limitTimeout) {
  const limiter = new Promise((_, reject) => setTimeout(reject, limitTimeout));
  return Promise.race([request, limiter]);
}

// dado um timeout maior que o esperado pela API, erro
{
  const limitTimeout = 100;
  assert.rejects(async () => {
    const fetchResult = await race(fetch(url), limitTimeout);
    return fetchResult.json();
  });
}

// dado timeout limite maior que o limite da API, sucesso!
{
  const limitTimeout = 500;
  const fetchResult = await race(fetch(url), limitTimeout);
  const result = await fetchResult.json();
  const expected = {
    name: 'Yago Neno',
    age: '28',
    profession: 'Software Developer',
  };

  assert.deepStrictEqual(result, expected, 'objects must have the same value');
}

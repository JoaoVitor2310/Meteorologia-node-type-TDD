describe('Beach forecast functional tests', () => {
  it('should return a forecast with just a few times', async () => { // Forecast é previsão
    const { body, status } = await global.testRequest.get('/forecast'); // Faz uma requisição na nossa api
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        // Resposta pronta que colocamos aqui e no teste como exemplo e testar o servidor
        time: '2020-04-26T00:00:00+00:00', // 1ª previsão, com os dados abaixo
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
          },
        ],
      },
      {
        time: '2020-04-26T01:00:00+00:00', // 2ª previsão, com os dados abaixo
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
          },
        ],
      },
    ]);
  });
});

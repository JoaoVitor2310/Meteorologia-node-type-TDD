import * as HTTPUtil from '@src/util/request';
import { StormGlass } from '@src/clients/stormGlass';
import stornGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours_fixture.json'; // Arquivo de exemplo de resposta da api para utilizar nos testes
import stornGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'; // Arquivo de exemplo, mas agora normalizado(no formato que a gente quer)

jest.mock('@src/util/request'); // Iremos "mockar" o axios. Isso significa que iremos simular um comportamento a partir dele

describe('StormGlass client', () => {
    // const mockedAxios = axios as jest.Mocked<typeof axios>; // Mocked é uma classe  do jest. Aqui o mockedAxios recebe os tipos do jest e do axios. O "as" é uma forçada do typescript para tipar, não se preocupe.
    const mockedRequest = new HTTPUtil.Request as jest.Mocked<HTTPUtil.Request>; //
    
    const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>;
    
    it('Should return the normalizes forecast form the StormGlass service', async () => { // Vamos pegar os dados da API e tratar eles para serem utilizados
        const lat = -33.792726; // Parâmetros para mandar pra API
        const lng = 151.289824;

        mockedRequest.get.mockResolvedValue({data: stornGlassWeather3HoursFixture} as HTTPUtil.Response); // O retorno simulado do axios será um objeto com data que definimos na pasta fixture

        const stormGlass = new StormGlass(mockedRequest); // Instância da classe
        const response = await stormGlass.fetchPoints(lat, lng); // Requisição será feita de dentro da classe criada.
        expect(response).toEqual(stornGlassNormalized3HoursFixture);
    })

    // Teste para checar se o objeto da API envia todas as chaves necessárias
    it('should exclude incomplete data points', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        const incompleteResponse = { // Resposta inconpleta para testar
          hours: [
            {
              windDirection: {
                noaa: 300,
              },
              time: '2020-04-26T00:00:00+00:00',
            },
          ],
        };
        mockedRequest.get.mockResolvedValue({ data: incompleteResponse} as HTTPUtil.Response);
        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);
    
        expect(response).toEqual([]);
      });


      it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
    
        mockedRequest.get.mockRejectedValue({ message: 'Network Error' });
    
        const stormGlass = new StormGlass(mockedRequest);
    
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow( // Espera um erro que seja lançado com a seguinte mensagem:
          'Unexpected error when trying to communicate to StormGlass: Network Error'
        );
      });

      it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
    
        class FakeAxiosError extends Error {
          constructor(public response: object) {
            super();
          }
        }

        MockedRequestClass.isRequestError.mockReturnValue(true);
    
        mockedRequest.get.mockRejectedValue(
          new FakeAxiosError({
            status: 429,
            data: { errors: ['Rate Limit reached'] },
          })
        );
    
        const stormGlass = new StormGlass(mockedRequest);
    
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
          'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
        );
    });
    
});
import axios from 'axios';
import { StormGlass } from '@src/clients/stormGlass';
import stornGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours_fixture.json'; // Arquivo de exemplo de resposta da api para utilizar nos testes
import stornGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'; // Arquivo de exemplo, mas agora normalizado(no formato que a gente quer)

jest.mock('axios'); // Iremos "mockar" o axios. Isso significa que iremos simular um comportamento a partir dele

describe('StormGlass client', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>; // Mocked é uma classe  do jest. Aqui o mockedAxios recebe os tipos do jest e do axios. O "as" é uma forçada do typescript, não se preocupe.
    it('Should return the normalizes forecast form the StormGlass service', async () => { // Vamos pegar os dados da API e tratar eles para serem utilzados
        const lat = -33.792726;
        const lng = 151.289824;

        mockedAxios.get.mockResolvedValue({data: stornGlassWeather3HoursFixture}); // O retorno simulado do axios será um objeto vazio

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual(stornGlassNormalized3HoursFixture);
    })
});
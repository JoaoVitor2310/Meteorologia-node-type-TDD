import { AxiosStatic } from "axios";

export interface StormGlassPointSource {
    [key: string]: number; // A chave será string, mas o valor é number

}

export interface StormGlassPoint {
    readonly time: string;
    readonly waveHeight: StormGlassPointSource;
    readonly waveDirection: StormGlassPointSource;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse { // Interface que será o padrão normalizado esperado da API externa
    hours: StormGlassPoint[]; // Hours é uma lista do tipo StormGlassPoint
}

export interface ForecastPoint {
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

export class StormGlass {
    readonly stormGlassApiParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassApiSource = 'noaa';

    constructor(protected request: AxiosStatic) { } // AxiosStatic é um tipo do axios, que diz que qnd iniciar a classe, tirá que passar um axios para ela 

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
        const response = await this.request.get<StormGlassForecastResponse>(`https://api.stormglass.io/v2/weather/point?params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&end=15921138026&lat=${lat}&lng=${lng}`, 
        {
            headers: {
                Authorization: 'fake-token',
              },
        });

        return this.normalizedResponse(response.data)
    }

      
    private normalizedResponse(points: StormGlassForecastResponse): ForecastPoint[] { // Resposta normalizada
        return points.hours.filter(this.isValidPoints.bind(this)).map((point) => ({ // O bind redefine o this, nesse caso ele diz que se refere a classe StormGlass, se não passasse, o this iria se referir ao isValidPoints.
            swellDirection: point.swellDirection[this.stormGlassApiSource],
            swellHeight: point.swellHeight[this.stormGlassApiSource],
            swellPeriod: point.swellPeriod[this.stormGlassApiSource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassApiSource],
            waveHeight: point.waveHeight[this.stormGlassApiSource],
            windDirection: point.windDirection[this.stormGlassApiSource],
            windSpeed: point.windSpeed[this.stormGlassApiSource],
        }));
    }

    private isValidPoints(point: Partial<StormGlassPoint>): boolean { // Função que valida as respostas. Partial diz que as propriedades são opcionais
        return !!( // "!!"" força o retorno ser boolean
            point.time &&
            point.swellDirection?.[this.stormGlassApiSource] && // "?." força um && sem precisar repetir. Nessa liha seria " point.swellDirection && point.swellDirection[this.stormGlassAPISource]". Traduzindo: se a chave existe, com o noaa, então retorne true.
            point.swellHeight?.[this.stormGlassApiSource] &&
            point.swellPeriod?.[this.stormGlassApiSource] &&
            point.waveDirection?.[this.stormGlassApiSource] &&
            point.waveHeight?.[this.stormGlassApiSource] &&
            point.windDirection?.[this.stormGlassApiSource] &&
            point.windSpeed?.[this.stormGlassApiSource]
        );
    }
}
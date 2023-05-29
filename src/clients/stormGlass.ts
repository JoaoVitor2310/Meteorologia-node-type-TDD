import { InternalError } from "@src/util/errors/internal-error";
import config, {IConfig} from 'config';
import * as HTTPUtil from '@src/util/request';

// PARA ENTENDER MELHOR AS INTERFACES, É ACONSELHADO LER DA ÚLTIMA ATÉ A PRIMEIRA!

export interface StormGlassPointSource {
    [key: string]: number; // A chave(sempre é 'noaa' nesse caso) será string, mas o valor é number

}

export interface StormGlassPoint { // Dados retornados da API, são readonly para nunca serem alterados
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

export interface ForecastPoint { // Interface que será o tipo normalizado que iremos gerar
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

export class ClientRequestError extends InternalError{ // Tratando o erro quando ele é no client, antes de chegar no serviço
    constructor(message: string){
        const internalMessage = 'Unexpected error when trying to communicate to StormGlass:';
        super(`${internalMessage} ${message}`);
    }
}

export class StormGlassResponseError extends InternalError {
    constructor(message: string){
        const internalMessage = 'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`)
    }
}

const stormGlassResourceConfig: IConfig = config.get('App.resources.StormGlass'); // Biblioteca config

export class StormGlass {
    readonly stormGlassApiParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'; // Dados não dinâmicos que iremos mandar na url e voltará na resposta 
    readonly stormGlassApiSource = 'noaa';

    // Quando essa classe é iniciada, tem que passar um request para ela.
    constructor(protected request = new HTTPUtil.Request()) { } // AxiosStatic é um tipo do axios, que diz que qnd iniciar a classe, tirá que passar um axios para ela 

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> { // Método que irá fazer as requisições na API
        try {
            const response = await this.request.get<StormGlassForecastResponse>(`${stormGlassResourceConfig.get('apiUrl')}/weather/point?params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&end=15921138026&lat=${lat}&lng=${lng}`,
                {
                    headers: { // Só para não esquecer de colocar o token depois.
                        Authorization: stormGlassResourceConfig.get('apiToken'),
                    },
                });
            return this.normalizedResponse(response.data);
        } catch(err) {
            if(HTTPUtil.Request.isRequestError(err)){ // Se o error for por causa do serviço, terá essas propriedades
                throw new StormGlassResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
            }
            throw new ClientRequestError(err.message);
        }
    }


    private normalizedResponse(points: StormGlassForecastResponse): ForecastPoint[] { // Gera resposta normalizada, recebe o points da API e retorna array ForecastPoint 
        // Iremos checar se os pontos são validos com a isValidPoints
        return points.hours.filter(this.isValidPoints.bind(this)).map((point) => ({ // O bind redefine o this, nesse caso ele diz que se refere a classe StormGlass, se não passasse, o this seria undefined.
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

    // Função que checa se o objeto retornado contém todas as chaves(informações do ponto)
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
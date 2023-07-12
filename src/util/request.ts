// Classe que será responsável por desacoplar a nossa aplicação do axios, ou seja, iremos fazer a requisição com o axios, mas se quisermos substituir futuramente, será possível. Para entender melhor, veja os tipos dando ctrl + clique no "axios" abaixo, lá terá o get, AxiosResponse, RequestConfig, etc. 

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestConfig extends AxiosRequestConfig { } // Nosso tipo de requisição 

export interface Response<T = any> extends AxiosResponse<T> { }

export class Request {
    constructor(private request = axios) { } // A classe recebe o axios

    public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> { // Iremos substituir o get do axios pelo nosso.
        return this.request.get<T, Response<T>>(url, config); // Retorna a resposta com o nosso tipo
    }

    public static isRequestError(error: AxiosError): boolean { // Método para identificar se o erro é do serviço StormGlass. É estático pq não usa o this para nada
        return !!(error.response && error.response.status); // Se o error for por causa do serviço, terá essas propriedades
    }
}
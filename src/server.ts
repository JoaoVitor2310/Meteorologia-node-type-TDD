import './util/module-alias';
import { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import {Server} from '@overnightjs/core';

export class SetupServer extends Server { // Classe do overnight que irá ajudar a utilizar o express com typescript
    constructor(private port = 3000){
        super();
    }

    public async init(): Promise<void> { // Inicia os métodos
        // this.setupExpress();
        this.setupControllers();
    }

    // private setupExpress(): void { // Método
        // this.app.use(bodyParser.json()); Body parser. Não é mais necessário utilizar
    // }

    private setupControllers(): void{ // Inicia o Forecast controller
        const forecastController = new ForecastController(); // Variável que recebe e inicia o controller
        this.addControllers([forecastController]); // Overnight recebe o controller e faz o setup no express
    }

    public getApp(): Application{
        return this.app;
    }
}
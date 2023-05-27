import { SetupServer } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
  // Irá preparar o ambiente para testes no desenvolvimento
  const server = new SetupServer(); // Instancia a classe
  server.init(); //Inicia os métodos
  global.testRequest = supertest(server.getApp()); // Estamos "setando" globalmente o server
});

//Muda as configurações do teste somente na pasta "test"

const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {...rootConfig, ...{
  rootDir: root,
  displayName: "end2end-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"], // Arquivo que roda antes, é útil para configurar, como o server global que estou utilizando e também banco de dados
  testMatch: ["<rootDir>/test/**/*.test.ts"],
}}
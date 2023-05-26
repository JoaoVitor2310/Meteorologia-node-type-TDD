
// Adiciona tipos aos tipos globais
declare global {
    var testRequest: import("supertest").SuperTest<import("supertest").Test>; // Tem que importar "inline" para funcionar
}

export{}
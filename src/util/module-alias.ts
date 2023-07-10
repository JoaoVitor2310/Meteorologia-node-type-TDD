
// VOLTAR NA AULA 1 DO CAPÍTULO 2 PARA ENTENDER E COMENTAR

import * as path from 'path';
import moduleAlias from 'module-alias';

const files = path.resolve(__dirname, '../../');

moduleAlias.addAliases({
  // Cria um alias(uma variável que vai apontar para o caminho do arquivo) para os destinos a seguir
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test'),
});

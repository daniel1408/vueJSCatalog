import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";

/**
 * @param {Array} array array to be ordered
 * @param {String} key key of value to be ordered
 */
export function orderArray(array, key) {
  let ordered = {};
  ordered = sortBy(array, (element) => element[key]);

  return ordered;
}

/**
 * @param { Array } arrayOne first array of object
 * @param { Array } arrayTwo first array of object
 * @param { String  } key key to be compared
 */
export function removeEqualsObjInArray(arrayOne, arrayTwo, key) {
  let result = arrayOne.filter(function (o1) {
    return !arrayTwo.some(function (o2) {
      return o1[key] === o2[key];
    });
  });

  return result;
}

/**
 * @param { Array } array array of object
 * @param { String } key name of property to be grouped
 */
export function groupBy(array, key) {
  const result = {};
  array.length &&
    array.forEach((item) => {
      if (!result[item[key]]) {
        result[item[key]] = [];
      }
      result[item[key]].push(item);
    });
  return result;
}

/**
 * @param { Date } date object to convert
 */
export function convertDate(date) {
  if (!date) return null;
  else {
    const [year, month, day] = date.split("-");
    return `${year}${month}${day}`;
  }
}

/**
 * @param { Obj1 } date object 1 to compare
 * @param { Obj2 } date object 2 to compare
 */
export function isEqualObject(obj1, obj2) {
  return isEqual(obj1, obj2);
}

export function timeConversion(millisec) {
  if (millisec !== null && millisec !== undefined) {
    let seconds = (millisec / 1000).toFixed(3);
    let minutes = (millisec / (1000 * 60)).toFixed(3);
    let hours = (millisec / (1000 * 60 * 60)).toFixed(3);
    let days = (millisec / (1000 * 60 * 60 * 24)).toFixed(3);

    if (seconds < 60) {
      return seconds + " Seg";
    } else if (minutes < 60) {
      return minutes + " Min";
    } else if (hours < 24) {
      return hours + " Hrs";
    } else {
      return days + " Dias";
    }
  } else {
    return "Não consta";
  }
}

export function cpfCheck(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;


  if (!strCPF || strCPF == "00000000000") return false;


  let cpf = strCPF.replace(/\./g, "");
  cpf = cpf.replace(/-/g, "");


  for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(10, 11))) return false;
  return true;
}


export function cnpjCheck(cnpj) {

  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14)
    return false;

  if (cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999")
    return false;


  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0))
    return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1))
    return false;

  return true;

}


export function VerifyErrorCode(errorCode) {
  switch (errorCode) {
    case 'auth/app-deleted':
      return 'O banco de dados não foi localizado.';
    case 'auth/expired-action-code':
      return 'O código da ação o ou link expirou.';
    case 'auth/invalid-action-code':
      return 'O código da ação é inválido. Isso pode acontecer se o código estiver malformado ou já tiver sido usado.';
    case 'auth/user-disabled':
      return 'O usuário correspondente à credencial fornecida foi desativado.';
    case 'auth/user-not-found':
      return 'O usuário não correponde à nenhuma credencial.';
    case 'auth/weak-password':
      return 'A senha é muito fraca.';
    case 'auth/email-already-in-use':
      return 'Já existe uma conta com o endereço de email fornecido.';
    case 'auth/invalid-email':
      return 'O endereço de e-mail não é válido.';
    case 'auth/operation-not-allowed':
      return 'O tipo de conta correspondente à esta credencial, ainda não encontra-se ativada.';
    case 'auth/account-exists-with-different-credential':
      return 'E-mail já associado a outra conta.';
    case 'auth/auth-domain-config-required':
      return 'A configuração para autenticação não foi fornecida.';
    case 'auth/credential-already-in-use':
      return 'Já existe uma conta para esta credencial.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Esta operação não é suportada no ambiente que está sendo executada. Verifique se deve ser http ou https.';
    case 'auth/timeout':
      return 'Excedido o tempo de resposta. O domínio pode não estar autorizado para realizar operações.';
    case 'auth/missing-android-pkg-name':
      return 'Deve ser fornecido um nome de pacote para instalação do aplicativo Android.';
    case 'auth/missing-continue-uri':
      return 'A próxima URL deve ser fornecida na solicitação.';
    case 'auth/missing-ios-bundle-id':
      return 'Deve ser fornecido um nome de pacote para instalação do aplicativo iOS.';
    case 'auth/invalid-continue-uri':
      return 'A próxima URL fornecida na solicitação é inválida.';
    case 'auth/unauthorized-continue-uri':
      return 'O domínio da próxima URL não está na lista de autorizações.';
    case 'auth/invalid-dynamic-link-domain':
      return 'O domínio de link dinâmico fornecido, não está autorizado ou configurado no projeto atual.';
    case 'auth/argument-error':
      return 'Verifique a configuração de link para o aplicativo.';
    case 'auth/invalid-persistence-type':
      return 'O tipo especificado para a persistência dos dados é inválido.';
    case 'auth/unsupported-persistence-type':
      return 'O ambiente atual não suportar o tipo especificado para persistência dos dados.';
    case 'auth/invalid-credential':
      return 'A credencial expirou ou está mal formada.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-verification-code':
      return 'O código de verificação da credencial não é válido.';
    case 'auth/invalid-verification-id':
      return 'O ID de verificação da credencial não é válido.';
    case 'auth/custom-token-mismatch':
      return 'O token está diferente do padrão solicitado.';
    case 'auth/invalid-custom-token':
      return 'O token fornecido não é válido.';
    case 'auth/captcha-check-failed':
      return 'O token de resposta do reCAPTCHA não é válido, expirou ou o domínio não é permitido.';
    case 'auth/invalid-phone-number':
      return 'O número de telefone está em um formato inválido (padrão E.164).';
    case 'auth/missing-phone-number':
      return 'O número de telefone é requerido.';
    case 'auth/quota-exceeded':
      return 'A cota de SMS foi excedida.';
    case 'auth/cancelled-popup-request':
      return 'Somente uma solicitação de janela pop-up é permitida de uma só vez.';
    case 'auth/popup-blocked':
      return 'A janela pop-up foi bloqueado pelo navegador.';
    case 'auth/popup-closed-by-user':
      return 'A janela pop-up foi fechada pelo usuário sem concluir o login no provedor.';
    case 'auth/unauthorized-domain':
      return 'O domínio do aplicativo não está autorizado para realizar operações.';
    case 'auth/invalid-user-token':
      return 'O usuário atual não foi identificado.';
    case 'auth/user-token-expired':
      return 'O token do usuário atual expirou.';
    case 'auth/null-user':
      return 'O usuário atual é nulo.';
    case 'auth/app-not-authorized':
      return 'Aplicação não autorizada para autenticar com a chave informada.';
    case 'auth/invalid-api-key':
      return 'A chave da API fornecida é inválida.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com a rede.';
    case 'auth/requires-recent-login':
      return 'O último horário de acesso do usuário não atende ao limite de segurança.';
    case 'auth/too-many-requests':
      return 'As solicitações foram bloqueadas devido a atividades incomuns. Tente novamente depois que algum tempo.';
    case 'auth/web-storage-unsupported':
      return 'O navegador não suporta armazenamento ou se o usuário desativou este recurso.';
    case 'auth/invalid-claims':
      return 'Os atributos de cadastro personalizado são inválidos.';
    case 'auth/claims-too-large':
      return 'O tamanho da requisição excede o tamanho máximo permitido de 1 Megabyte.';
    case 'auth/id-token-expired':
      return 'O token informado expirou.';
    case 'auth/id-token-revoked':
      return 'O token informado perdeu a validade.';
    case 'auth/invalid-argument':
      return 'Um argumento inválido foi fornecido a um método.';
    case 'auth/invalid-creation-time':
      return 'O horário da criação precisa ser uma data UTC válida.';
    case 'auth/invalid-disabled-field':
      return 'A propriedade para usuário desabilitado é inválida.';
    case 'auth/invalid-display-name':
      return 'O nome do usuário é inválido.';
    case 'auth/invalid-email-verified':
      return 'O e-mail é inválido.';
    case 'auth/invalid-hash-algorithm':
      return 'O algoritmo de HASH não é uma criptografia compatível.';
    case 'auth/invalid-hash-block-size':
      return 'O tamanho do bloco de HASH não é válido.';
    case 'auth/invalid-hash-derived-key-length':
      return 'O tamanho da chave derivada do HASH não é válido.';
    case 'auth/invalid-hash-key':
      return 'A chave de HASH precisa ter um buffer de byte válido.';
    case 'auth/invalid-hash-memory-cost':
      return 'O custo da memória HASH não é válido.';
    case 'auth/invalid-hash-parallelization':
      return 'O carregamento em paralelo do HASH não é válido.';
    case 'auth/invalid-hash-rounds':
      return 'O arredondamento de HASH não é válido.';
    case 'auth/invalid-hash-salt-separator':
      return 'O campo do separador de SALT do algoritmo de geração de HASH precisa ser um buffer de byte válido.';
    case 'auth/invalid-id-token':
      return 'O código do token informado não é válido.';
    case 'auth/invalid-last-sign-in-time':
      return 'O último horário de login precisa ser uma data UTC válida.';
    case 'auth/invalid-page-token':
      return 'A próxima URL fornecida na solicitação é inválida.';
    case 'auth/invalid-password':
      return 'A senha é inválida, precisa ter pelo menos 6 caracteres.';
    case 'auth/invalid-password-hash':
      return 'O HASH da senha não é válida.';
    case 'auth/invalid-password-salt':
      return 'O SALT da senha não é válido.';
    case 'auth/invalid-photo-url':
      return 'A URL da foto de usuário é inválido.';
    case 'auth/invalid-provider-id':
      return 'O identificador de provedor não é compatível.';
    case 'auth/invalid-session-cookie-duration':
      return 'A duração do COOKIE da sessão precisa ser um número válido em milissegundos, entre 5 minutos e 2 semanas.';
    case 'auth/invalid-uid':
      return 'O identificador fornecido deve ter no máximo 128 caracteres.';
    case 'auth/invalid-user-import':
      return 'O registro do usuário a ser importado não é válido.';
    case 'auth/invalid-provider-data':
      return 'O provedor de dados não é válido.';
    case 'auth/maximum-user-count-exceeded':
      return 'O número máximo permitido de usuários a serem importados foi excedido.';
    case 'auth/missing-hash-algorithm':
      return 'É necessário fornecer o algoritmo de geração de HASH e seus parâmetros para importar usuários.';
    case 'auth/missing-uid':
      return 'Um identificador é necessário para a operação atual.';
    case 'auth/reserved-claims':
      return 'Uma ou mais propriedades personalizadas fornecidas usaram palavras reservadas.';
    case 'auth/session-cookie-revoked':
      return 'O COOKIE da sessão perdeu a validade.';
    case 'auth/uid-alread-exists':
      return 'O indentificador fornecido já está em uso.';
    case 'auth/email-already-exists':
      return 'O e-mail fornecido já está em uso.';
    case 'auth/phone-number-already-exists':
      return 'O telefone fornecido já está em uso.';
    case 'auth/project-not-found':
      return 'Nenhum projeto foi encontrado.';
    case 'auth/insufficient-permission':
      return 'A credencial utilizada não tem permissão para acessar o recurso solicitado.';
    case 'auth/internal-error':
      return 'O servidor de autenticação encontrou um erro inesperado ao tentar processar a solicitação.';
    default:
      return null;
  }
}


export function getUsers() {
  return [
    {
      "id": 0,
      "cpf": "01234567890",
      "name": "Usuário Teste 1",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 1,
      "cpf": "01234567890",
      "name": "Usuário Teste 2",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 2,
      "cpf": "01234567890",
      "name": "Usuário Teste 3",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 3,
      "cpf": "01234567890",
      "name": "Usuário Teste 4",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 4,
      "cpf": "01234567890",
      "name": "Usuário Teste 5",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
  ]
}


export function getClientList() {

  return[
    {
      id: 0,
      name: "Daniel Costa",
      cpf: "01234567890",
      firstPhoneNumber: "3499212222",
      secondPhoneNumber: "3499212222",
      email: "daniel@teste.com",
      city: "São Paulo",
      state: "SP",
      cnpj: "0123456789000112",
      contactName: "Fulano",
      address1: "Rua teste",
      address2: "122",
      complement: "AP 12222"
    },
    {
      id: 1,
      name: "Saulo Costa",
      cpf: "01234567890",
      firstPhoneNumber: "3499212222",
      secondPhoneNumber: "3499212222",
      email: "saulo@teste.com",
      city: "São Paulo",
      state: "SP",
      cnpj: "0123456789000112",
      contactName: "Fulano",
      address1: "Rua teste",
      address2: "122",
      complement: "AP 12222"
    },
    {
      id: 2,
      name: "Paulo Costa",
      cpf: "01234567890",
      firstPhoneNumber: "3499212222",
      secondPhoneNumber: "3499212222",
      email: "paulo@teste.com",
      city: "São Paulo",
      state: "SP",
      cnpj: "0123456789000112",
      contactName: "Fulano",
      address1: "Rua teste",
      address2: "122",
      complement: "AP 12222"
    },
    {
      id: 3,
      name: "Daniel Costa",
      cpf: "01234567890",
      firstPhoneNumber: "3499212222",
      secondPhoneNumber: "3499212222",
      email: "daniel@teste.com",
      city: "São Paulo",
      state: "SP",
      cnpj: "0123456789000112",
      contactName: "Fulano",
      address1: "Rua teste",
      address2: "122",
      complement: "AP 12222"
    },
    {
      id: 4,
      name: "Saulo Costa",
      cpf: "01234567890",
      firstPhoneNumber: "3499212222",
      secondPhoneNumber: "3499212222",
      email: "saulo@teste.com",
      city: "São Paulo",
      state: "SP",
      cnpj: "0123456789000112",
      contactName: "Fulano",
      address1: "Rua teste",
      address2: "122",
      complement: "AP 12222"
    },
    {
      id: 5,
      name: "Paulo Costa",
      cpf: "01234567890",
      firstPhoneNumber: "3499212222",
      secondPhoneNumber: "3499212222",
      email: "paulo@teste.com",
      city: "São Paulo",
      state: "SP",
      cnpj: "0123456789000112",
      contactName: "Fulano",
      address1: "Rua teste",
      address2: "122",
      complement: "AP 12222"
    }
  ]
  
}
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
    return "N??o consta";
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
      return 'O banco de dados n??o foi localizado.';
    case 'auth/expired-action-code':
      return 'O c??digo da a????o o ou link expirou.';
    case 'auth/invalid-action-code':
      return 'O c??digo da a????o ?? inv??lido. Isso pode acontecer se o c??digo estiver malformado ou j?? tiver sido usado.';
    case 'auth/user-disabled':
      return 'O usu??rio correspondente ?? credencial fornecida foi desativado.';
    case 'auth/user-not-found':
      return 'O usu??rio n??o correponde ?? nenhuma credencial.';
    case 'auth/weak-password':
      return 'A senha ?? muito fraca.';
    case 'auth/email-already-in-use':
      return 'J?? existe uma conta com o endere??o de email fornecido.';
    case 'auth/invalid-email':
      return 'O endere??o de e-mail n??o ?? v??lido.';
    case 'auth/operation-not-allowed':
      return 'O tipo de conta correspondente ?? esta credencial, ainda n??o encontra-se ativada.';
    case 'auth/account-exists-with-different-credential':
      return 'E-mail j?? associado a outra conta.';
    case 'auth/auth-domain-config-required':
      return 'A configura????o para autentica????o n??o foi fornecida.';
    case 'auth/credential-already-in-use':
      return 'J?? existe uma conta para esta credencial.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Esta opera????o n??o ?? suportada no ambiente que est?? sendo executada. Verifique se deve ser http ou https.';
    case 'auth/timeout':
      return 'Excedido o tempo de resposta. O dom??nio pode n??o estar autorizado para realizar opera????es.';
    case 'auth/missing-android-pkg-name':
      return 'Deve ser fornecido um nome de pacote para instala????o do aplicativo Android.';
    case 'auth/missing-continue-uri':
      return 'A pr??xima URL deve ser fornecida na solicita????o.';
    case 'auth/missing-ios-bundle-id':
      return 'Deve ser fornecido um nome de pacote para instala????o do aplicativo iOS.';
    case 'auth/invalid-continue-uri':
      return 'A pr??xima URL fornecida na solicita????o ?? inv??lida.';
    case 'auth/unauthorized-continue-uri':
      return 'O dom??nio da pr??xima URL n??o est?? na lista de autoriza????es.';
    case 'auth/invalid-dynamic-link-domain':
      return 'O dom??nio de link din??mico fornecido, n??o est?? autorizado ou configurado no projeto atual.';
    case 'auth/argument-error':
      return 'Verifique a configura????o de link para o aplicativo.';
    case 'auth/invalid-persistence-type':
      return 'O tipo especificado para a persist??ncia dos dados ?? inv??lido.';
    case 'auth/unsupported-persistence-type':
      return 'O ambiente atual n??o suportar o tipo especificado para persist??ncia dos dados.';
    case 'auth/invalid-credential':
      return 'A credencial expirou ou est?? mal formada.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-verification-code':
      return 'O c??digo de verifica????o da credencial n??o ?? v??lido.';
    case 'auth/invalid-verification-id':
      return 'O ID de verifica????o da credencial n??o ?? v??lido.';
    case 'auth/custom-token-mismatch':
      return 'O token est?? diferente do padr??o solicitado.';
    case 'auth/invalid-custom-token':
      return 'O token fornecido n??o ?? v??lido.';
    case 'auth/captcha-check-failed':
      return 'O token de resposta do reCAPTCHA n??o ?? v??lido, expirou ou o dom??nio n??o ?? permitido.';
    case 'auth/invalid-phone-number':
      return 'O n??mero de telefone est?? em um formato inv??lido (padr??o E.164).';
    case 'auth/missing-phone-number':
      return 'O n??mero de telefone ?? requerido.';
    case 'auth/quota-exceeded':
      return 'A cota de SMS foi excedida.';
    case 'auth/cancelled-popup-request':
      return 'Somente uma solicita????o de janela pop-up ?? permitida de uma s?? vez.';
    case 'auth/popup-blocked':
      return 'A janela pop-up foi bloqueado pelo navegador.';
    case 'auth/popup-closed-by-user':
      return 'A janela pop-up foi fechada pelo usu??rio sem concluir o login no provedor.';
    case 'auth/unauthorized-domain':
      return 'O dom??nio do aplicativo n??o est?? autorizado para realizar opera????es.';
    case 'auth/invalid-user-token':
      return 'O usu??rio atual n??o foi identificado.';
    case 'auth/user-token-expired':
      return 'O token do usu??rio atual expirou.';
    case 'auth/null-user':
      return 'O usu??rio atual ?? nulo.';
    case 'auth/app-not-authorized':
      return 'Aplica????o n??o autorizada para autenticar com a chave informada.';
    case 'auth/invalid-api-key':
      return 'A chave da API fornecida ?? inv??lida.';
    case 'auth/network-request-failed':
      return 'Falha de conex??o com a rede.';
    case 'auth/requires-recent-login':
      return 'O ??ltimo hor??rio de acesso do usu??rio n??o atende ao limite de seguran??a.';
    case 'auth/too-many-requests':
      return 'As solicita????es foram bloqueadas devido a atividades incomuns. Tente novamente depois que algum tempo.';
    case 'auth/web-storage-unsupported':
      return 'O navegador n??o suporta armazenamento ou se o usu??rio desativou este recurso.';
    case 'auth/invalid-claims':
      return 'Os atributos de cadastro personalizado s??o inv??lidos.';
    case 'auth/claims-too-large':
      return 'O tamanho da requisi????o excede o tamanho m??ximo permitido de 1 Megabyte.';
    case 'auth/id-token-expired':
      return 'O token informado expirou.';
    case 'auth/id-token-revoked':
      return 'O token informado perdeu a validade.';
    case 'auth/invalid-argument':
      return 'Um argumento inv??lido foi fornecido a um m??todo.';
    case 'auth/invalid-creation-time':
      return 'O hor??rio da cria????o precisa ser uma data UTC v??lida.';
    case 'auth/invalid-disabled-field':
      return 'A propriedade para usu??rio desabilitado ?? inv??lida.';
    case 'auth/invalid-display-name':
      return 'O nome do usu??rio ?? inv??lido.';
    case 'auth/invalid-email-verified':
      return 'O e-mail ?? inv??lido.';
    case 'auth/invalid-hash-algorithm':
      return 'O algoritmo de HASH n??o ?? uma criptografia compat??vel.';
    case 'auth/invalid-hash-block-size':
      return 'O tamanho do bloco de HASH n??o ?? v??lido.';
    case 'auth/invalid-hash-derived-key-length':
      return 'O tamanho da chave derivada do HASH n??o ?? v??lido.';
    case 'auth/invalid-hash-key':
      return 'A chave de HASH precisa ter um buffer de byte v??lido.';
    case 'auth/invalid-hash-memory-cost':
      return 'O custo da mem??ria HASH n??o ?? v??lido.';
    case 'auth/invalid-hash-parallelization':
      return 'O carregamento em paralelo do HASH n??o ?? v??lido.';
    case 'auth/invalid-hash-rounds':
      return 'O arredondamento de HASH n??o ?? v??lido.';
    case 'auth/invalid-hash-salt-separator':
      return 'O campo do separador de SALT do algoritmo de gera????o de HASH precisa ser um buffer de byte v??lido.';
    case 'auth/invalid-id-token':
      return 'O c??digo do token informado n??o ?? v??lido.';
    case 'auth/invalid-last-sign-in-time':
      return 'O ??ltimo hor??rio de login precisa ser uma data UTC v??lida.';
    case 'auth/invalid-page-token':
      return 'A pr??xima URL fornecida na solicita????o ?? inv??lida.';
    case 'auth/invalid-password':
      return 'A senha ?? inv??lida, precisa ter pelo menos 6 caracteres.';
    case 'auth/invalid-password-hash':
      return 'O HASH da senha n??o ?? v??lida.';
    case 'auth/invalid-password-salt':
      return 'O SALT da senha n??o ?? v??lido.';
    case 'auth/invalid-photo-url':
      return 'A URL da foto de usu??rio ?? inv??lido.';
    case 'auth/invalid-provider-id':
      return 'O identificador de provedor n??o ?? compat??vel.';
    case 'auth/invalid-session-cookie-duration':
      return 'A dura????o do COOKIE da sess??o precisa ser um n??mero v??lido em milissegundos, entre 5 minutos e 2 semanas.';
    case 'auth/invalid-uid':
      return 'O identificador fornecido deve ter no m??ximo 128 caracteres.';
    case 'auth/invalid-user-import':
      return 'O registro do usu??rio a ser importado n??o ?? v??lido.';
    case 'auth/invalid-provider-data':
      return 'O provedor de dados n??o ?? v??lido.';
    case 'auth/maximum-user-count-exceeded':
      return 'O n??mero m??ximo permitido de usu??rios a serem importados foi excedido.';
    case 'auth/missing-hash-algorithm':
      return '?? necess??rio fornecer o algoritmo de gera????o de HASH e seus par??metros para importar usu??rios.';
    case 'auth/missing-uid':
      return 'Um identificador ?? necess??rio para a opera????o atual.';
    case 'auth/reserved-claims':
      return 'Uma ou mais propriedades personalizadas fornecidas usaram palavras reservadas.';
    case 'auth/session-cookie-revoked':
      return 'O COOKIE da sess??o perdeu a validade.';
    case 'auth/uid-alread-exists':
      return 'O indentificador fornecido j?? est?? em uso.';
    case 'auth/email-already-exists':
      return 'O e-mail fornecido j?? est?? em uso.';
    case 'auth/phone-number-already-exists':
      return 'O telefone fornecido j?? est?? em uso.';
    case 'auth/project-not-found':
      return 'Nenhum projeto foi encontrado.';
    case 'auth/insufficient-permission':
      return 'A credencial utilizada n??o tem permiss??o para acessar o recurso solicitado.';
    case 'auth/internal-error':
      return 'O servidor de autentica????o encontrou um erro inesperado ao tentar processar a solicita????o.';
    default:
      return null;
  }
}


export function getUsers() {
  return [
    {
      "id": 0,
      "cpf": "01234567890",
      "name": "Usu??rio Teste 1",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 1,
      "cpf": "01234567890",
      "name": "Usu??rio Teste 2",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 2,
      "cpf": "01234567890",
      "name": "Usu??rio Teste 3",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 3,
      "cpf": "01234567890",
      "name": "Usu??rio Teste 4",
      "firstPhoneNumber": "01234567890",
      "secondPhoneNumber": "01234567890",
      "email": "teste1@gmail.com",
      "masterName": "MASTER1",
      "userType": "VENDEDOR"
    },
    {
      "id": 4,
      "cpf": "01234567890",
      "name": "Usu??rio Teste 5",
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
      city: "S??o Paulo",
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
      city: "S??o Paulo",
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
      city: "S??o Paulo",
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
      city: "S??o Paulo",
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
      city: "S??o Paulo",
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
      city: "S??o Paulo",
      state: "SP",
      cnpj: "0123456789000112",
      contactName: "Fulano",
      address1: "Rua teste",
      address2: "122",
      complement: "AP 12222"
    }
  ]
  
}
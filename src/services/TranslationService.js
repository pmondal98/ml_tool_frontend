import axios from "axios";

const GET_TRANSLATION_URL = "http://localhost:8080/getTranslation/";

const GET_LANGUAGE_URL = "http://localhost:8080/getLanguage";

const GET_IMPORT_URL = "http://localhost:8080/importTranslation/";

var languageId = -1;

class TranslationService {
  getAllTranslationByLang(langId) {
    languageId = langId;
    return axios.get(GET_TRANSLATION_URL + languageId);
  }
  getAllLanguage() {
    return axios.get(GET_LANGUAGE_URL);
  }
  getImportTranslation(flag, data) {
    return axios.get(GET_IMPORT_URL + flag + "/" + data);
  }
}

export default new TranslationService();

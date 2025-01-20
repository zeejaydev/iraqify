import { useContext } from "react";
import * as RNLocalize from "react-native-localize";
import { LanguageContext } from "../shared/languageContext";

export const language = ()=>{
    const lang = RNLocalize.getLocales()[0];
    return lang.languageCode;
}
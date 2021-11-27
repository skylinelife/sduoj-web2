import {deepClone} from "@ant-design/charts/es/util";
import {ConfigState} from "../../Type/IConfig";
import {ConfigAction} from "../Action/config";

const initState: ConfigState = {
    lang: "zh",
}


export const ConfigReducer = (state: ConfigState = initState, action: ConfigAction) => {
    // 此处不做深拷贝，redux无法检测到更新
    let State = deepClone(state)

    switch (action.type) {
        case "updateLanguage":
            State.lang = action.lang
            return State
    }

    return State
}
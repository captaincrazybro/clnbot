const validateModel = (model) => {
    let i = 0;
    let key, val, entries = Object.entries(model);
    try {
        while (i < model.length) {
            [key, val] = entries[i];
            console.log("keys", key, val);
            if (!val) throw new Error("Model Validation Error - No value given.");
            if (!key) throw new Error("Model Validation Error - No key given.");
            if (!val.type) throw new Error("Model Validation Error - No type given for " + val);
            if (typeof (val.type) != "string") throw new Error("Model Validation Error - required must be a string");
            if (typeof (val.required) != "boolean") throw new Error("Model Validation Error - required must be boolean");
            i++;
        }
    }
    catch (e) {
        console.log(e);
        return false;
    }
    return true;
}
const validateModelValues = (model, json) => {
    if (!validateModel(model)) break;
    let i = 0;
    let key, val, entries = model.entries();
    try {
        if (json.length > model.length) throw new Error("Model Error - Json contains more keys than the model.")
        while (i < model.length) {
            [key, val] = entries[i];
            if (json[key] == undefined && val.required) throw new Error(`Model Error - Json does not contain ${key} and the value is required.`)
            else if (json[key] != val.type) throw new Error(`Model Error - Json value ${json[key]} is not ${val.type}`)
            i++;
        }

    }
    catch (e) {
        console.log(e);
        return false;
    }
    return true;
}
module.exports = { validateModel, validateModelValues };
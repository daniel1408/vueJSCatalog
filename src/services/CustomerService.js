import HttpMap from "./mapsApi";

let config = {
    headers: {
        "Content-Type": "application/json"
    }
}

export const
    getDataByCep = (cep) => HttpMap.get(`ws/${cep}/json/`, config); 
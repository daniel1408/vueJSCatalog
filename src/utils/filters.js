import moment from "moment";

export const filters = [
    {
        name: "truncate",
        execute: (value, position) => {
            let text = value;
            if (value && position < value.length) {
                text = value.substring(0, position) + "...";
            }
            return text;
        }
    },
    {
        name: "capitalize",
        execute: value => {
            if (!value) return "";
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    {
        name: "uppercase",
        execute: value => {
            return value.toUpperCase();
        }
    },
    {
        name: "formatDate",
        execute: value => {
            if (value) {
                return moment(String(value)).format("MM/DD/YYYY hh:mm");
            }
        }
    },

];
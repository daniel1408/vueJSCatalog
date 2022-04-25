import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md',
    },
    theme: {
        primary: '#00a772',
        secondary: '#f42674',
        accent: '#323639',
        error: '#b71c1c'
    }
});
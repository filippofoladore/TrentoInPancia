import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import Space from '../components/Space'
import Search from '../components/Search'
import List from '../components/List'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/list',
        name: 'List',
        component: List
    },
    {
        path: '/space',
        name: 'Space',
        component: Space
    },
    {
        path: '/search',
        name: 'Search',
        component: Search
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    }
]
});

export default router
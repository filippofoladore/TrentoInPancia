import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import MyVotes from '../components/MyVotes'
import About from '../components/About'
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
        path: '/myvotes',
        name: 'MyVotes',
        component: MyVotes
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    }
]
});

export default router
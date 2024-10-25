import axios from "axios";

const HOST ="http://localhost:8080/cinema/";

export const endpoints = {
    'log-in': '/auth/token',
    'log-out': '/auth/logout',
    'sign-up': '/users', 
    'current-user': '/users/my-info',
    'movies': '/movies',
    'schedules': '/show-schedules',
    'seats': '/seats',
    'items': '/items',
    'promotions': '/promotions',
    'create-tickets': '/tickets',
    'create-bill': '/bills',
    'vn-pay': '/payment/vn-pay',

    // admin
    'bills': '/bills',
    'genres': '/genres',
    'permissions': '/permissions',
    'roles': '/roles',
    'show-events': '/show-events',
    'show-rooms': '/show-rooms',
    'show-schedules': '/show-schedules',
    'showtimes': '/showtimes',
    'tags': '/tags',
    'tickets': '/tickets',
    'users': '/users',
    'comments': '/comments'
}

export const auThApi = (accessToken)=> axios.create({
        baseURL:HOST,
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })

export default axios.create({
    baseURL : HOST
})
import axiosClient from './axiosClient';

const cartsApi = {
    // async getAll(userId) {
    //     // Transform _page to _start
    //     const cartList = await axiosClient.get(`/api/user/${userId}`,
    //         //  { params: newParams }
    //         );
    //     return cartList;
    // },
    async getAll(userId) {
        const url = `api/carts/user/${userId}`;
        return axiosClient.get(url);
    },

    get(id) {
        const url = `api/carts/${id}`;
        return axiosClient.get(url);
    },

    add(payload) {
        const url = 'api/carts';
        return axiosClient.post(url,payload);
    },

    update(data) {
        const url = `api/cart/${data.id}`;
        return axiosClient.patch(url, data);
    },

    remove(id) {
        const url = `api/cart/${id}`;
        return axiosClient.delete(url);
    },
};

export default cartsApi;
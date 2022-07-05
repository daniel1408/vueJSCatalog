import Http from "./http";

export const
    getUsers = (master) => Http.get(`/user/full?masterName=${master}`),
    getAllUsers = () => Http.get(`/user/all`),
    getUsersById = (id, master) => Http.get(`/user/full?requestToken=${id}&masterName=${master}`),
    postUser = (data) => Http.post(`/user`, data),
    putUser = (user) => Http.put(`/user/${user.id}`, user),
    deleteUser = (id) => Http.delete(`/user?requestToken=${id}`),

    getLogs = (id, master) => {
        const token = id ? `?requestToken=${id}&masterName=${master}` : `?masterName=${master}`;
        return Http.get(`/log/full${token}`);
    },

    postLog = (data) => Http.post(`/log`, data),
    putLog = (user) => Http.put(`/log/${user.id}`, user),
    deleteLog = (id) => Http.delete(`/log/${id}`),

    postClient = (client) => Http.post(`/client`, client),
    putClient = (client) => Http.put(`/client/${client.id}`, client),
    deleteClient = (id) => Http.delete(`/client/${id}`),

    getClientList = (id, master) => {
        const token = id ? `?requestToken=${id}&masterName=${master}` : `?masterName=${master}`;
        return Http.get(`client/full${token}`);
    },

    postProposal = (proposal) => Http.post(`/proposal`, proposal),
    putProposal = (proposal) => Http.put(`/proposal/${proposal.id}`, proposal),
    deleteProposal = (id) => Http.delete(`/proposal/${id}`),
    getProposalList = (id, master) => {
        const token = id ? `?requestToken=${id}&masterName=${master}` : `?masterName=${master}`;
        return Http.get(`/proposal/full${token}`);
    },

    postBudget = (data) => Http.post(`/budget`, data),
    putBudget = (data) => Http.put(`/budget/${data.id}`, data),
    deleteBudget = (id) => Http.delete(`/budget/${id}`),
    getBudgetList = (id, master) => {
        const token = id ? `?requestToken=${id}&masterName=${master}` : `?masterName=${master}`;
        return Http.get(`/budget/full${token}`);
    },

    uploadImage = (data) => Http.post(`/media/clothe/${data.clotheId}/uploadImage`, data.payload),
    confirmClotheSent = (data) => Http.patch(`/order/${data.orderId}/confirmClotheSent?orderId=${data.orderId}&trackCode=${data.trackCode}`);

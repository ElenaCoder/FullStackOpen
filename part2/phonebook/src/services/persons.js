import axios from 'axios';
const baseUrl =
    process.env.NODE_ENV === 'production'
        ? 'https://fullstack-open-part3-phonebook-qlu1.onrender.com/api/persons'
        : '/api/persons';

const getAllPersons = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const createPerson = (newObject) => {
    const request = axios.post(baseUrl, newObject);
    return request.then((response) => response.data);
};

const updatePerson = (id, updatedPerson) => {
    return axios
        .put(`${baseUrl}/${id}`, updatedPerson)
        .then((response) => response.data);
};

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then((response) => response.data);
};

export default { getAllPersons, createPerson, updatePerson, deletePerson };

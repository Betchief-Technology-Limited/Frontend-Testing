import axios from "axios";

axios.defaults.baseURL = "http://localhost:3006/api";
axios.defaults.withCredentials = true;

export function createOrGetDraft(payload){
    return axios.post("/organization/draft", payload)
}

export function saveDraft(id, step, payload){
    return axios.patch(`/organization/draft/${id}`, { step, payload })
}

export function uploadDocuments(id, formData){
    return axios.post(`/organization/draft/${id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export function submitOnboarding(id){
    return axios.post(`/organization/submit/${id}`);
}

export function getOrganizationByClient(clientId){
    return axios.get(`/organization/client/${clientId}`)
}
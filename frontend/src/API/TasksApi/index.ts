import { IForm } from "../../components/DataInputForm";
import { IApiResponse } from "../apiResponse.type";
import axiosInstance from "../axiosInstance";

export const TasksApi = {
    get: async () => {
        const response = await axiosInstance.get<IApiResponse<IForm[]>>("/tasks");
       
        return response;
    },
    post: async (data: IForm) => {
        const response = await axiosInstance.post<IApiResponse<IForm>>("/tasks", data);
       
        return response;
    },
    put: async (id: string, data: IForm) => {
        const response = await axiosInstance.put<IApiResponse<IForm>>(`/tasks/${id}`, data);
       
        return response;
    },
    patch: async (id: string, data: Partial<IForm>) => {
        const response = await axiosInstance.patch<IApiResponse<IForm>>(`/tasks/${id}`, data);
       
        return response;
    },
    delete: async (id: string) => {
        const response = await axiosInstance.delete<IApiResponse<null>>(`/tasks/${id}`);
       
        return response;
    }
};

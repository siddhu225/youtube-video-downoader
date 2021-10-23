import Api from "@/services/Api";

export default {
  addNew(params) {
    return Api().post('/new', params)
  },
  getVideo(params) {
    return Api().get(`/file/${params.fileName}`, {
      ...params,
      responseType: "blob",
    })
  },
};
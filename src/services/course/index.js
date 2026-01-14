import Api from "../../network/axiosClients";


export const getAllCategoryApi = async (data) => {
    return Api.get("lms/category/all");
};
export const AddCategoryApi = async (data, id) => {
    return Api.post(`lms/category/?env=lms`, data);
};
export const getCategoryByIdApi = async (id) => {
    return Api.get(`lms/course/${id}?env=lms`);
};
export const getCoursesByCategoryId = async (categoryId) => {
    return Api.get(`public/lms/courses?categoryId=${categoryId}`);
}

export const getAllCourseApi = async (data) => {
    return Api.get("lms/course/all?env=lms");
};

export const getAllMyCourseApi = async (id) => {
    return Api.get(`lms/course/my-course?studentId=${id}&trainerId=${id}`);
};

export const getCourseByIdApi = async (id) => {
    return Api.get(`lms/course/${id}?env=lms`);
};
export const AddCourseApi = async (data, id) => {
    return Api.post(`lms/course`, data);
};
export const updatedCourseApi = async (data, id) => {
    return Api.put(`lms/course/${id}?env=lms`, data);
};


export const AddLessonApi = async (data) => {
    return Api.post(`lms/lesson?env=lms`, data);
};
export const editLessonApi = async (data, id) => {
    return Api.put(`lms/lesson/${id}?env=lms`, data);
};
export const getAllLessonApi = async () => {
    return Api.get("lms/lesson/lov?env=lms");
};
export const getLeaasonByCourseId = async (courseID) => {
    return Api.get(`public/lms/lesson?courseId=${courseID}`);
};

export const getLessonByIdApi = async (id) => {
    return Api.get(`lms/lesson/${id}`);
};


export const AddChapterApi = async (data) => {
    return Api.post(`lms/chapter?env=lms`, data);
};
export const EditChapterApi = async (data, id) => {
    return Api.put(`lms/chapter/${id}?env=lms`, data);
};
export const getChaptersByLessonId = async (lessonId) => {
    return Api.get(`public/lms/chapter?lessonId=${lessonId}`);
};
export const getChaptersVideoByChapterId = async (chapterId, userId) => {
    return Api.get(`lms/chapter/${chapterId}/chapter-video?userId=${userId}`);
};

export const getChapterByIdApi = async (id) => {
    return Api.get(`lms/chapter/${id}`);
};

export const getAllCoursePublic = async (id) => {
    return Api.get(`public/lms/courses`);
}


export const getAllCoursePublicWithQueryParams = async (queryParams) => {
    return Api.get(`public/lms/courses`, { params: queryParams });
}



export const AddLibraryApi = async (data) => {
    return Api.post(`lms/library`, data);
};
export const editLibraryApi = async (data, id) => {
    return Api.put(`lms/library/${id}?env=lms`, data);
};
export const getibraryByIdApi = async (id) => {
    return Api.get(`lms/library/${id}`);
};
export const getAllLibraryByCourseIdApi = async (id, fileName) => {
    return Api.get(`lms/library/all?courseId=${id}&fileName=${fileName}`);
};

export const changeCourseStatusApi = async (id, data) => {
    return Api.put(`lms/chapter/user-chapter-video/${id}`, data);
};

export const getCourseProgressApi = async (courseId, userId) => {
    return Api.get(`lms/chapter/chapter-video/progress?courseId=${courseId}&userId=${userId}`,);
};


export const AddWebinarApi = async (data) => {
    return Api.post(`lms/webinar`, data);
};
export const AssociateWebinarApi = async (data) => {
    return Api.post(`lms/myWebinar/enroll`, data);
};
export const getAllWebinar = async (data) => {
    return Api.get(`lms/webinar/all`, data);
};
export const getWebinarByIdApi = async (id) => {
    return Api.get(`lms/webinar/${id}`);
};

export const getPerformanceByCourseId = async (courseId, userId) => {
    return Api.get(`lms/quiz/performance?courseId=${courseId}&userId=${userId}`);
}

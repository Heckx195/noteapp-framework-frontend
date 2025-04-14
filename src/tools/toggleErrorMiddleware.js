import axiosInstance from './axiosInstance';

const toggleErrorMiddleware = async (checked) => {
  try {
    const response = await axiosInstance.post('/toggle-error-middleware', {
      checked,
    });
    return response.data.isErrorMiddlewareEnabled;
  } catch (error) {
    console.error('Error toggling error middleware:', error);
    throw error;
  }
};

export default toggleErrorMiddleware;

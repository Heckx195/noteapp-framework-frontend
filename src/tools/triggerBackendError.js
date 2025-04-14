import axiosInstance from './axiosInstance';

const triggerBackendError = async () => {
  await axiosInstance.get('/trigger-error');
};

export default triggerBackendError;

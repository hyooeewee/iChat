import Toast from 'react-hot-toast';

const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    // console.error(error.message);
    Toast.error(error.message);
  } else {
    // console.error('An unknown error occurred:', error);
    Toast.error('An unknown error occurred');
  }
};

export default handleApiError;

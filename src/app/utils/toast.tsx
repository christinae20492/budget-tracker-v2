import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const successToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const failToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const warnToast = (message: string) =>{
  toast.warn(message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: undefined,
    });
}

export const progressToast = (message: string) =>{
  toast.info(message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: undefined,
    });
}
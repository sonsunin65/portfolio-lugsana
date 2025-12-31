
import Swal from 'sweetalert2';

export const SwalFire = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#fe7ab6', // Primary color match
      timer: 2000,
      timerProgressBar: true,
    });
  },
  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#ef4444',
    });
  },
  confirm: async (title: string, text?: string, confirmText: string = 'ใช่, ลบเลย!') => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmText,
      cancelButtonText: 'ยกเลิก'
    });
    return result.isConfirmed;
  }
};

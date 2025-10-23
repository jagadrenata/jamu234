import Swal from 'sweetalert2'

type AlertFunction = (title?: string, text?: string | null, timer?: number) => void
type AlertConfirmFunction = (title?: string, text?: string) => Promise<boolean>

export const alertSuccess: AlertFunction = (title = 'Berhasil', text = '', timer = 2500) => {
  Swal.fire({
    icon: 'success',
    title,
    text: text ?? '',
    confirmButtonColor: '#2189EA',
    showConfirmButton: true,
    timer,
    timerProgressBar: true,
  })
}

export const alertError: AlertFunction = (title = 'Terjadi Kesalahan', text = '') => {
  Swal.fire({
    icon: 'error',
    title,
    text: text ?? '',
    confirmButtonColor: '#2189EA',
    showConfirmButton: true,
  })
}

export const alertInfo: AlertFunction = (title = 'Informasi', text = '') => {
  Swal.fire({
    icon: 'info',
    title,
    text: text ?? '',
    confirmButtonColor: '#2189EA',
  })
}


export const alertConfirm: AlertConfirmFunction = async (
  title = 'Yakin?',
  text = 'Tindakan ini tidak bisa dibatalkan.'
) => {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text: text ?? '',
    showCancelButton: true,
    confirmButtonColor: '#2189EA',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, lanjutkan!',
    cancelButtonText: 'Batal',
  })
  return result.isConfirmed
}
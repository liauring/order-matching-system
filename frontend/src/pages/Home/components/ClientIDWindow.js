import Swal from 'sweetalert2'
import { useStatus } from '../../../global/useStatus'

const ClientIDWindow = () => {
  const { clientID, setClientID } = useStatus()

  function isValid(inputID) {
    return inputID !== '' && inputID !== null && !isNaN(parseInt(inputID, 10)) && inputID > 0 && inputID.length < 3
  }
  if (!clientID) {
    Swal.fire({
      title: '請輸入用戶ID',
      input: 'text',
      inputPlaceholder: '(1~99)',
      inputAttributes: {
        autocapitalize: 'off',
      },
      confirmButtonText: '送出',
      showLoaderOnConfirm: true,
      preConfirm: (id) => {
        if (!isValid(id)) {
          Swal.showValidationMessage('ID不符合格式')
        }
        return id
      },
      allowOutsideClick: false,
    }).then((result) => {
      setClientID(parseInt(result.value))
    })
  }
}
export default ClientIDWindow

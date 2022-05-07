// $(window).ready(function () {
//   console.log('hihi')
// })
function showClientID() {
  swal({
    text: '請輸入用戶ID (兩位數字)',
    content: 'input',
  }).then((value) => {
    if (value !== '' && value !== null && !isNaN(parseInt(value, 10)) && value > 0 && value.length < 3) {
      swal(`你的用戶ID為：${value}，歡迎來到 Connie Playground！`)
    } else {
      // return value
    }
  })

  // )
  // swal('What your name!', {
  //   content: 'input',
  // }).then((value) => {
  //   if (value !== '' && value !== null) {
  //     swal(`Welcome back! ${value}.`)
  //   }
  // })
  // swal(
  //   {
  //     title: '算術題',
  //     text: '請問1+1等於多少?',
  //     type: 'input',
  //     inputPlaceholder: '請輸入答案',
  //     showCancelButton: true,
  //     confirmButtonText: '作答',
  //     cencelButton: '取消',
  //     closeOnConfirm: false,
  //     closeOnCancel: false,
  //   },
  //   function (answer) {
  //     if (!answer) {
  //       swal({
  //         title: '取消',
  //         text: '這麼簡單的題目，你也不回答嗎？！',
  //         type: 'warning',
  //       })
  //     } else {
  //       if (+answer === 2) {
  //         swal({
  //           title: '答對啦！',
  //           text: '你真是天才！',
  //           type: 'success',
  //         })
  //       } else {
  //         swal({
  //           title: '答錯囉！',
  //           text: '再想想看，很簡單的！',
  //           type: 'error',
  //         })
  //       }
  //     }
  //   }
  // )
  // swal({
  //   title: 'Are you sure?',
  //   icon: 'warning',
  //   buttons: true,
  //   dangerMode: true,
  // })

  // swal(
  //   {
  //     title: 'Title...',
  //     text: 'Hello World!',
  //     type: 'success',
  //   },
  //   function () {
  //     console.log('bye')
  //   }
  // )
}
window.onload = showClientID

export default {
  select_lib: 'Chọn một thư viện hình ảnh',
  show_list: 'Hiển thị danh sách thư viện',
  import_single: 'Nhập đơn',
  import_multi: 'Nhập nhiều',
  open: 'Mở dưới dạng tài liệu mới',
  buttons: [
    {
      title: 'Thư viện hình ảnh'
    }
  ],
  imgLibs: [
    {
      name: 'Thư viện demo (cục bộ)',
      url: '{path}imagelib/index{modularVersion}.html',
      description: 'Thư viện trình diễn để chỉnh sửa SVG trên máy chủ này'
    },
    {
      name: 'Thư viện biểu tượng IAN',
      url: 'https://ian.umces.edu/symbols/catalog/svgedit/album_chooser.php?svgedit=3',
      description: 'Thư viện minh họa miễn phí'
    }
    // The site is no longer using our API, and they have added an
    //   `X-Frame-Options` header which prevents our usage cross-origin:
    // Getting messages like this in console:
    //   Refused to display 'https://openclipart.org/detail/307176/sign-bike' in a frame
    //   because it set 'X-Frame-Options' to 'sameorigin'.
    // url: 'https://openclipart.org/svgedit',
    // However, they do have a custom API which we are using here:
    /*
    {
      name: 'Openclipart',
      url: '{path}imagelib/openclipart{modularVersion}.html',
      description: 'Share and Use Images. Over 100,000 Public Domain SVG Images and Growing.'
    }
    */
  ]
};

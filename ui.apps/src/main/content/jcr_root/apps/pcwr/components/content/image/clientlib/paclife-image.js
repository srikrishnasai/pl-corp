$(document).ready(function () {

  $('.paclife-image').each(function () {
    var imgWidth = $(this).find('.pacific-life-image').width();
    if (imgWidth && imgWidth > 0) {
      $(this).css('max-width', imgWidth);
    }
  });
  $('#paclife-image-modal').on('shown.bs.modal', function () {
    var $highResImage = $(this).find('.pacific-life-high-res-image');
    if ($highResImage && $highResImage.length > 0) {
      var imgSrc = $highResImage.attr('data-img-src');
      if (imgSrc) {
        $highResImage.attr('src', imgSrc);
        $highResImage.css('opacity', '1');
      }
    }
  })
});

$(document).ready(function() {

  $('.paclife-image').each(function() {
      var isFullScreenImgAuthored = $(this).find('.paclife-image-full-screen-btn');
      if(isFullScreenImgAuthored && isFullScreenImgAuthored.length > 0) {
        var isCenterAligned = $(this).attr('data-is-image-center-aligned');
        var imgWidth = $(this).find('.pacific-life-image').width();
        var imgContainerWidth = $(this).width();
        if (imgWidth && imgWidth > 0 && imgContainerWidth) {
            var fullScreenIconRightOffSet;
            if(isCenterAligned && isCenterAligned === 'true') {
                fullScreenIconRightOffSet = ((imgContainerWidth - imgWidth) / 2) + 30;
            } else {
                fullScreenIconRightOffSet = (imgContainerWidth - imgWidth) + 30;
            }
            isFullScreenImgAuthored.css('right', fullScreenIconRightOffSet + 'px');
        }
      }    
  });

  $('#paclife-image-modal').on('shown.bs.modal', function() {  
    var $highResImage = $(this).find('.pacific-life-high-res-image');
      if ($highResImage && $highResImage.length > 0) {
          var imgSrc = $highResImage.attr('data-img-src');
          if (imgSrc) {
              $highResImage.attr('src', imgSrc);
              $highResImage.css('opacity', '1');
              $(this).find('.modal-body__overlay').hide();
          }
      }
  })
});
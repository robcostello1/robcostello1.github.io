'use strict';

function dpm(thing) {
  console.log(thing);
}

(function ($) {

  // Settings
  var scrollSpeed = 1000;

  // At any point on page, check if on screen
  function onScreen(element, offset) {
    var bottomScroll = $(window).height() + $(window).scrollTop();
    // dpm(element)
    // dpm(bottomScroll)
    // dpm(element.offset().top + offset);
    return bottomScroll > (element.offset().top + offset);
  }

  // Do things while scrolling and on page ready (+ a second)
  function readyAndScroll(callback) {
    setTimeout(function() {
      callback();
    }, 100);

    if (parallaxEnabled()) {
      $('main').scroll(callback);
    }
    else {
      $(window).scroll(callback);
    }
  }

  function parallaxEnabled() {
    return $('.preserve3d').length > 0 && window.innerWidth > window.innerHeight;
  }

  // Display text when we scroll to it
  (function reveal() {
     $(document).ready(function() {
      var revealItems = $('.js-reveal');
      var hideArrow = $('.js-hide-arrow');
      // Stop if none
      if (revealItems.length === 0) {
        return;
      }
      readyAndScroll(function(){
        revealItems.each(function() {
          var item = $(this);
          if (onScreen(item, 250) && !item.hasClass('js-in')) {
            setTimeout(function() {
              item.addClass('js-in');
            }, 700);
            if (item.hasClass('js-hide-prev-arrow') && !hideArrow.hasClass('js-out')) {
              hideArrow.addClass('js-out')
            }
          }
        });
      });

      // Bottom
      var bottomRevealItems = $('.js-bottom-reveal');
      // Stop if none
      if (bottomRevealItems.length === 0) {
        return;
      }
      readyAndScroll(function(){
        bottomRevealItems.each(function() {
          var item = $(this);
          if (onScreen(item, 0) && !item.hasClass('js-in')) {
            item.addClass('js-in');
          }
        });
      });
    });
  })();

  // Normal anchor behaviour
  (function anchors() {
    // If parallax is possible
    // and we're in landscape, stop
    if (parallaxEnabled()) {
      return;
    }

    function anchorScroll(this_obj, that_obj, base_speed, offset) {
      var this_offset = this_obj.offset();
      var that_offset = that_obj.offset();
      // Causing weird behaviour
      var offset_diff = Math.abs(that_offset.top - this_offset.top);
      $('html,body').animate({
        scrollTop: that_offset.top - offset
      }, base_speed);
    }

    $('a[href^="#"]').click(function (e) {
      e.preventDefault();
      anchorScroll($(this), $($(this).attr('href')), scrollSpeed, 0);
    });

  })();

  // Special anchor behaviour for parralax
  (function parallaxAnchors() {
    // If parallax is not possible (which means we don't try)
    // or we're in portrait, stop
    if (!parallaxEnabled()) {
      return;
    }

    function scrollToPoint(point) {
      $('main').animate({
        scrollTop: point
      }, {
        duration: scrollSpeed,
        easing: 'easeInOutQuad'
      });
    }

    function anchorScroll(this_obj, that_obj, offset) {
      var screenHeight = $(window).height();
      var topOf1 = $('#1').offset().top;
      var topOfThis = that_obj.offset().top;
      scrollToPoint(topOfThis - topOf1 - offset);
    }

    function anchorScrollToParallax(this_obj, that_obj, offset) {
      var this_height = this_obj.height();
      var that_height = that_obj.height();
      scrollToPoint(this_height - that_height / 1.43 - offset);
    }

    var linkTo2 = $('[href="#2"]');
    var linkTo3 = $('[href="#3"]');

    linkTo2.click(function (e) {
      e.preventDefault();
      anchorScrollToParallax($('#1'), $('#2'), 0);
    });

    linkTo3.click(function (e) {
      e.preventDefault();
      anchorScroll(linkTo3, $('#3'), 0);
    });
  })();

  (function modal() {
    $('.js-cta-link').click(function() {
      $('.js-cta-modal').addClass('js-in');
    });
    $('.js-cta-modal').click(function() {
      $('.js-cta-modal').removeClass('js-in');
    });
  })();

})(jQuery);

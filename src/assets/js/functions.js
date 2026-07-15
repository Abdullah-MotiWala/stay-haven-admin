$(document).ready(function () {

	$('.ohist-item a.histry-down').click(function () {
		$(this).parents('.ohist-item').addClass('current').siblings().removeClass('current');
	})

	$(".toggle-password").click(function () {
		$(this).toggleClass("fa-eye fa-eye-slash");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});


	$('.big_media').owlCarousel({
		loop: true,
		margin: 3,
		nav: false,
		dots: false,
		autoplay: true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			1000: {
				items: 3
			}
		}
	})


	$('.tutf-slider').owlCarousel({
		loop: true,
		margin: 20,
		nav: false,
		dots: false,
		autoplay: true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			1000: {
				items: 3
			}
		}
	})

	$('.tuts-slider').owlCarousel({
		loop: true,
		margin: 20,
		nav: false,
		dots: false,
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			1000: {
				items: 4
			}
		}
	})


	$('.course_slides').owlCarousel({
		loop: true,
		margin: 20,
		nav: false,
		dots: false,
		autoplay: true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			1000: {
				items: 4
			}
		}
	})



	$('.testslider').owlCarousel({
		loop: true,
		margin: 20,
		nav: false,
		//navText:['<i class="fa fa-angle-left" aria-hidden="true"></i>' , '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
		dots: true,
		autoplay: true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 2
			},
			1000: {
				items: 3
			}
		}
	})



	$('.opensub').click(function () {
		$(this).parent().toggleClass('current').siblings();
		$(this).siblings('.mob-sub-menu').toggle('slow');
	});

	$('.mobile-overlay , .mobile-close').click(function () {
		$("#mobile-menu").removeClass("mopen");
		$('.mobile-overlay').removeClass('moverlay');
		$('.mobile-close').removeClass('mclose');
	});

	$('#mobile-btn').click(function () {
		$("#mobile-menu").toggleClass("mopen");
		$('.mobile-overlay').addClass('moverlay');
		$('.mobile-close').addClass('mclose');
	});

});

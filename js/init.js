$.fn.DeeboProgressIsInViewport = function(content) {
	"use strict";
	return $(this).offset().top - content.outerHeight();
};
/*
 * Copyright (c) 2021 Frenify
 * Author: Frenify
 * This file is made for CURRENT TEMPLATE
*/


(function($){
  "use strict";
  
  
		var FrenifyDeebo = {

			init: function(){
				FrenifyDeebo.BgImg();
				FrenifyDeebo.imgToSVG();
				FrenifyDeebo.progress();
				FrenifyDeebo.resume();
				FrenifyDeebo.contactForm();
				FrenifyDeebo.anchor();
				FrenifyDeebo.aos();
				FrenifyDeebo.scrollProgress();
			},
			
			aos: function(){
				if(typeof AOS === 'undefined'){
					return;
				}
				AOS.init({
					duration: 800,
					easing: 'ease-out-cubic',
					once: true,
					offset: 80
				});
				var scrollContainer = document.querySelector('.cv__content');
				if(scrollContainer){
					var ticking = false;
					scrollContainer.addEventListener('scroll', function(){
						if(ticking){
							return;
						}
						ticking = true;
						window.requestAnimationFrame(function(){
							AOS.refresh();
							ticking = false;
						});
					});
				}
			},
			
			scrollProgress: function(){
				var bar = document.querySelector('.scroll_progress__bar');
				if(!bar){
					return;
				}
				var scrollEl = document.querySelector('.cv__content') || document.querySelector('.deebo_fn__cv');
				var useWindow = !scrollEl;
				var lastValue = '';
				var update = function(){
					var scrollTop;
					var scrollHeight;
					var clientHeight;
					if(useWindow){
						scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
						scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
						clientHeight = window.innerHeight;
					}else{
						scrollTop = scrollEl.scrollTop;
						scrollHeight = scrollEl.scrollHeight;
						clientHeight = scrollEl.clientHeight;
					}
					var max = scrollHeight - clientHeight;
					var progress = max > 0 ? (scrollTop / max) : 0;
					if(progress < 0){
						progress = 0;
					}else if(progress > 1){
						progress = 1;
					}
					var value = progress.toFixed(4);
					if(value !== lastValue){
						bar.style.transform = 'scaleX(' + value + ')';
						lastValue = value;
					}
				};
				var ticking = false;
				var onScroll = function(){
					if(ticking){
						return;
					}
					ticking = true;
					window.requestAnimationFrame(function(){
						update();
						ticking = false;
					});
				};
				update();
				if(useWindow){
					window.addEventListener('scroll', onScroll, {passive: true});
				}else{
					scrollEl.addEventListener('scroll', onScroll, {passive: true});
				}
				window.addEventListener('resize', onScroll);
			},
		
		anchor: function(){

			$('.anchor').on('click',function(){
				var selector = '.cv__content';
				if($(window).width() <= 1040){
					selector = 'body,html';
				}
				if($.attr(this, 'href') !== '#'){
					$(selector).animate({
						scrollTop: $($.attr(this, 'href')).offset().top
					}, 800);
				}

				return false;
			});	
		},
		
		contactForm: function(){
			var sendButton = $('#send_message');
			if(!sendButton.length){ return; }
			var sendLabel = sendButton.text();
			var isSending = false;
			sendButton.on('click', function(e){
				e.preventDefault();
				if(isSending){ return false; }
				var form		= $('.section_contact .contact_form');
				var name 		= $("#name").val().trim();
				var subject 	= $("#subject").val().trim();
				var message 	= $("#message").val().trim();
				var spanSuccess	= form.find(".success");
				var success     = spanSuccess.data('success');
				var emptyNotice = form.find(".empty_notice");
				var emptyNoticeText = emptyNotice.find("span");

				spanSuccess.empty();
				if(name === ''|| subject === ''|| message === ''){
					emptyNoticeText.text('Please fill in required fields.');
					emptyNotice.slideDown(500).delay(2000).slideUp(500);
					return false;
				}

				isSending = true;
				sendButton.addClass('is-loading').text('Sending...');
				emptyNotice.hide();

				fetch(form.attr('action') || '/api/contact', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: name,
						subject: subject,
						message: message
					})
				}).then(function(response){
					if(!response.ok){ throw new Error('Request failed'); }
					spanSuccess.append("<span class='contact_success'>" + success + "</span>");
					spanSuccess.slideDown(500).delay(4000).slideUp(500);
					if(form.length){ form[0].reset(); }
				}).catch(function(){
					emptyNoticeText.text('Unable to send message. Please try again.');
					emptyNotice.slideDown(500).delay(3000).slideUp(500);
				}).finally(function(){
					isSending = false;
					sendButton.removeClass('is-loading').text(sendLabel);
				});
				return false; 
			});
		},
		
		
		resume: function(){
			$('.deebo_fn__cv .cv__content').scrollTop(0);
			$('body').addClass('resume-opened');
		},
		
		progress: function(){
			var content = $('.deebo_fn__cv .cv__content');
			if($(window).width() <= 768){
				content = $('.deebo_fn__cv');
			}
			content.on('resize scroll', function() {
				if ($('.deebo_fn__cv .fn_cs_progress_bar').DeeboProgressIsInViewport(content) < 0) {
					FrenifyDeebo.progressF($('.deebo_fn__cv .fn_cs_progress_bar'));
				}
			});
		},
		
		progressF: function(container){
			container.find('.progress_item').each(function(i) {
				var progress 	= $(this);
				var pValue 		= parseInt(progress.data('value'));
				var percent 	= progress.find('.progress_percent');
				var pBar 		= progress.find('.progress_bg');
				pBar.css({width:pValue+'%'});
				setTimeout(function(){
					progress.addClass('open');
					percent.html(pValue+'%').css({right:(100 - pValue)+ '%'});
				},(i*500));
			});	
		},
		
		imgToSVG: function(){
			$('img.fn__svg').each(function(){
				var img 		= $(this);
				var imgClass	= img.attr('class');
				var imgURL		= img.attr('src');

				$.get(imgURL, function(data) {
					var svg 	= $(data).find('svg');
					if(typeof imgClass !== 'undefined') {
						svg 	= svg.attr('class', imgClass+' replaced-svg');
					}
					img.replaceWith(svg);

				}, 'xml');

			});	
		},

	  	BgImg: function(){
			var div = $('*[data-bg-img]');
			div.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-bg-img');
				var dataBg	= element.data('bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.css({backgroundImage:'url('+dataBg+')'});
				}
			});
		},
    
  	};
  	
	
	// READY Functions
	$(document).ready(function(){FrenifyDeebo.init();});
  	
})(jQuery);

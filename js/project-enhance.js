(function () {
	'use strict';

	function initScrollProgress() {
		var bar = document.querySelector('.scroll_progress__bar');
		if (!bar) {
			return;
		}

		var ticking = false;

		var update = function () {
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
			var clientHeight = window.innerHeight;
			var max = scrollHeight - clientHeight;
			var progress = max > 0 ? (scrollTop / max) : 0;

			if (progress < 0) {
				progress = 0;
			} else if (progress > 1) {
				progress = 1;
			}

			bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
		};

		var onScroll = function () {
			if (ticking) {
				return;
			}
			ticking = true;
			window.requestAnimationFrame(function () {
				update();
				ticking = false;
			});
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initScrollProgress);
	} else {
		initScrollProgress();
	}
})();

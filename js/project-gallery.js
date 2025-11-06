/**
 * Lightweight carousel for project detail galleries.
 * Transforms any .project__gallery[data-gallery] container into a slider that shows one figure at a time.
 */
(function () {
	'use strict';

	class ProjectGallery {
		constructor(root) {
			this.root = root;
			this.track = root.querySelector('.project__gallery-track');
			if (!this.track) {
				return;
			}

			this.slides = Array.from(this.track.querySelectorAll('figure'));
			if (!this.slides.length) {
				return;
			}

			this.prevBtn = root.querySelector('[data-gallery-prev]');
			this.nextBtn = root.querySelector('[data-gallery-next]');
			this.dotsContainer = root.querySelector('[data-gallery-dots]');
			this.index = 0;

			this.root.classList.add('is-carousel');
			if (this.slides.length > 1) {
				this.root.classList.add('has-multiple');
				this.createDots();
				this.attachEvents();
			} else {
				this.toggleNav(false);
			}

			this.update();
		}

		createDots() {
			if (!this.dotsContainer) {
				return;
			}
			this.dots = this.slides.map((_, idx) => {
				const button = document.createElement('button');
				button.type = 'button';
				button.className = 'project__gallery-dot';
				button.setAttribute('aria-label', `Show image ${idx + 1}`);
				button.addEventListener('click', () => this.goTo(idx));
				this.dotsContainer.appendChild(button);
				return button;
			});
		}

		attachEvents() {
			if (this.prevBtn) {
				this.prevHandler = () => this.goTo(this.index - 1);
				this.prevBtn.addEventListener('click', this.prevHandler);
			}

			if (this.nextBtn) {
				this.nextHandler = () => this.goTo(this.index + 1);
				this.nextBtn.addEventListener('click', this.nextHandler);
			}
		}

		goTo(targetIndex) {
			const total = this.slides.length;
			if (!total) {
				return;
			}

			const wrappedIndex = ((targetIndex % total) + total) % total;
			if (wrappedIndex === this.index) {
				return;
			}

			this.index = wrappedIndex;
			this.update();
		}

		update() {
			const offset = -this.index * 100;
			this.track.style.transform = `translate3d(${offset}%, 0, 0)`;

			this.slides.forEach((slide, idx) => {
				const isActive = idx === this.index;
				slide.setAttribute('aria-hidden', String(!isActive));
				slide.toggleAttribute('data-active', isActive);
			});

			if (this.dots) {
				this.dots.forEach((dot, idx) => {
					if (idx === this.index) {
						dot.setAttribute('aria-current', 'true');
					} else {
						dot.removeAttribute('aria-current');
					}
				});
			}
		}

		toggleNav(enabled) {
			const buttons = [this.prevBtn, this.nextBtn];
			buttons.forEach((btn) => {
				if (!btn) {
					return;
				}
				if (enabled) {
					btn.removeAttribute('disabled');
					btn.setAttribute('aria-disabled', 'false');
				} else {
					btn.setAttribute('disabled', 'true');
					btn.setAttribute('aria-disabled', 'true');
				}
			});
		}
	}

	function initGalleries() {
		const galleries = document.querySelectorAll('[data-gallery]');
		galleries.forEach((gallery) => new ProjectGallery(gallery));
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initGalleries);
	} else {
		initGalleries();
	}
})();

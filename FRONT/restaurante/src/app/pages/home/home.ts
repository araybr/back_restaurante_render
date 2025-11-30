import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import {RouterLink} from '@angular/router';

declare var $: any;
declare var WOW: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    RouterLink
  ],
  encapsulation: ViewEncapsulation.None
})
export class Home implements AfterViewInit {

  ngAfterViewInit(): void {
    this.loadScript('assets/js/modernizer.js')
      .then(() => this.loadScript('assets/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => this.loadAllJsAndInit())
      .catch(err => console.error(err));
  }

  private loadAllJsAndInit(): void {
    this.loadScript('assets/js/all.js')
      .then(() => {

        if (typeof WOW !== 'undefined') {
          new WOW().init();
        }

        if ($('#owl-demo').length && typeof ($('#owl-demo') as any).owlCarousel === 'function') {
          ($('#owl-demo') as any).owlCarousel({
            autoPlay: 3000,
            items: 3,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [979, 2]
          });
        }

        if ($('.slider-single').length && $('.slider-nav').length
          && typeof ($('.slider-single') as any).slick === 'function') {

          ($('.slider-single') as any).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: false,
            adaptiveHeight: true,
            infinite: false,
            speed: 400,
            cssEase: 'cubic-bezier(0.77, 0, 0.18, 1)'
          });

          ($('.slider-nav') as any)
            .on('init', (event: any, slick: any) => {
              $('.slider-nav .slick-slide.slick-current').addClass('is-active');
            })
            .slick({
              slidesToShow: 4,
              slidesToScroll: 7,
              dots: false,
              focusOnSelect: false,
              infinite: false,
              responsive: [
                { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4 } },
                { breakpoint: 769, settings: { slidesToShow: 4, slidesToScroll: 4 } },
                { breakpoint: 420, settings: { slidesToShow: 3, slidesToScroll: 3 } }
              ]
            });

          ($('.slider-single') as any).on('afterChange', (event: any, slick: any, currentSlide: number) => {
            ($('.slider-nav') as any).slick('slickGoTo', currentSlide);
            const curSlide = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
            $('.slider-nav .slick-slide.is-active').removeClass('is-active');
            $(curSlide).addClass('is-active');
          });

          ($('.slider-nav') as any).on('click', '.slick-slide', (event: any) => {
            event.preventDefault();
            const goToSingleSlide = $(event.currentTarget).data('slick-index');
            ($('.slider-single') as any).slick('slickGoTo', goToSingleSlide);
          });
        }
      })
      .catch(err => console.error(err));
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`No se pudo cargar ${url}`);
      document.body.appendChild(script);
    });
  }
}

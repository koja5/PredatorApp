import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[lazyLoadImage]'
})
export class LazyLoadImageDirective implements OnInit {
  @Input('lazyLoadImage') src!: string;
  @HostBinding('attr.src') imageSrc = './assets/icon/loader.gif';

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.imageSrc = this.src;
        this.observer.disconnect();
      }
    }, {
      rootMargin: '50px'
    });

    this.observer.observe(this.el.nativeElement);
  }
}

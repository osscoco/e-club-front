import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'ytEmbedUrl', standalone: true })
export class YtEmbedUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(link: string): SafeResourceUrl | null {
    const id = this.extractId(link);
    if (!id) return null;
    const url = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private extractId(url: string): string | null {
    const m = url?.match(/(?:v=|\/(?:shorts|embed)\/|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
}
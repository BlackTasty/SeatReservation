import { Breadcrumb } from './model/breadcrumb';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  public toolbarTitle = '';
  public breadcrumbs: Breadcrumb[] = [];

  constructor(private pageTitleService: Title) { }

  public hasBreadcrumbs(): boolean {
    return this.breadcrumbCount() > 0;
  }

  public breadcrumbCount(): number {
    return !!this.breadcrumbs ? this.breadcrumbs.length : 0;
  }

  setToolbarTitle(title: string, resetBreadcrumbs: boolean): void {
    this.toolbarTitle = title;
    this.pageTitleService.setTitle(title);
    if (resetBreadcrumbs) {
      this.breadcrumbs = [];
    }
  }

  addBreadcrumb(name: string, routerLink: string): void {
    if (this.breadcrumbs.length > 0) {
      if (this.breadcrumbs.findIndex(b => b.routerLink === routerLink) > -1) {
        return;
      }

      for (const breadcrump of this.breadcrumbs) {
        breadcrump.isActive = false;
      }
    }
    this.breadcrumbs.push(new Breadcrumb(name, routerLink, true, this.breadcrumbCount() + 1));
  }

  removeBreadcrumb(): void {
    if (this.breadcrumbs.length > 0) {
      this.breadcrumbs.pop();

      if (this.breadcrumbs.length > 0) {
        this.breadcrumbs[this.breadcrumbs.length - 1].isActive = true;
      }
    }
  }

  clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }
}

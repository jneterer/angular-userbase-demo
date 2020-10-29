import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserResult } from 'userbase-js';
import { IError } from '../contracts/iuserbase';
import { UserbaseService } from '../userbase.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  user: UserResult;

  constructor(private router: Router,
              private userbaseService: UserbaseService) { }

  ngOnInit(): void {
    this.userbaseService.$currentUser.pipe(takeUntil(this.unsubscribe))
    .subscribe((user: UserResult) => {
      this.user = user;
    });
  }

  /**
   * Signs the user out and navigates them home.
   * @param {MouseEvent} event 
   */
  signOut(event: MouseEvent): void {
    this.userbaseService.signOut()
    .subscribe((result) => {
      this.router.navigate(['/signin']);
    }, (error: IError) => {
      this.router.navigate(['/signin']);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

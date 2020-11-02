import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, retryWhen, takeUntil } from 'rxjs/operators';
import { Session } from 'userbase-js';
import { IError } from '../../contracts/iuserbase';
import { UserbaseService } from '../../userbase.service';

@Component({
  selector: 'app-initialization-error',
  templateUrl: './initialization-error.component.html',
  styleUrls: ['./initialization-error.component.css']
})
export class InitializationErrorComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private userbaseService: UserbaseService) { }

  ngOnInit(): void {
    this.userbaseService.initializeUserbase().pipe(
      takeUntil(this.unsubscribe),
      retryWhen((errors: Observable<IError>) => {
        // Retries the initialization request every 5 seconds.
        return errors.pipe(delay(5000));
      })
    ).subscribe((session: Session) => {
      if (session.user) {
        this.router.navigate(['/app/todos']);
      } else {
        this.router.navigate(['/signin']);
      }
    }, (error) => console.log('error: ', error));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
